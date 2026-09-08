# Publishing API 設定
# ※重要: Environment用のAutomation Clientを使用してください（Organization用ではありません）
# XM Cloud Deploy App → Credentials → Environment タブ → Create credentials → Automation client
# Environment用のClientには自動的に xmcloud.cm:admin スコープが付与されます
$apiEndpoint = "https://edge-platform.sitecorecloud.io/authoring/publishing/v1/jobs"

# OAuth認証情報（Environment用 Automation Client）
$clientId = $env:AUTOPUBLISH_CLIENTID
$clientSecret = $env:AUTOPUBLISH_CLIENTSECRET
$authTokenUrl = "https://auth.sitecorecloud.io/oauth/token"
$authAudience = "https://api.sitecorecloud.io"
# パブリッシュジョブ設定
$jobName = "AutoPublish Job"
$jobSource = "AutoPublish"

# パブリッシング設定
$sourceDatabase = "master"
$publishMode = "Incremental" # "Republish","Incremental" "Smart" のいずれか
$languages = "en, en-001, ja-JP, en-150, en-GB, en-IE, fi-FI, fr-FR, se-SE, da, et-EE, fr-BE, fr-LU, nl-NL, es-ES, pt-PT, de-DE, de-AT, de-CH, en-TT, en-US, en-CA, fr-CA, en-AU, en-NZ, en-BZ, ta-IN, th-TH, en-ZW, te-IN, vi-VN, zh-TW, en-PH, hi-IN, ms-MY, en-JM, zh-CN, es-CO, fr-CH, ko-KR, pl-PL, pt-BR, ru-RU, ja, id-ID, zh-SG, en-ZA, nl-BE, zh-HK"

# ログ出力関数
# INFOログ出力
function Write-LogInfo($msg) {
    Write-Host "[INFO] $msg"
    [Sitecore.Diagnostics.Log]::Info($msg, "AutoPublish")
}

# ERRORログ出力
function Write-LogError($msg) {
    Write-Host "[ERROR] $msg"
    [Sitecore.Diagnostics.Log]::Error($msg, "AutoPublish")
}

# メイン処理
try {
    # START LOG
    Write-LogInfo "START:AutoPublish"

    # Config input check
    if ([string]::IsNullOrWhiteSpace($sourceDatabase)) {
        Write-LogError "[AutoPublish]:No value is set in the SourceDatabase Config."
        return
    }

    if ([string]::IsNullOrWhiteSpace($publishMode)) {
        Write-LogError "[AutoPublish]:No value is set in the Mode Config."
        return
    }

    # データベース取得
    $db = Get-Database -Name $sourceDatabase

    # Config Existence check
    $configPath = "/sitecore/content/Config/AutoPublishConfig"
    $config = Get-Item -Path $configPath -Database $db -ErrorAction SilentlyContinue

    if (-not $config) {
        Write-LogError "[AutoPublish]:The config item does not exist."
        return
    }

    # If Run Publish is unchecked, the process will terminate
    $runPublishField = $config.Fields["Run Publish"]
    if (-not $runPublishField -or $runPublishField.Value -ne "1") {
        Write-LogInfo "[AutoPublish]:Run Publish is unchecked so auto publishing is stopped."
        return
    }

    # JWT Token取得
    if ([string]::IsNullOrWhiteSpace($clientId) -or [string]::IsNullOrWhiteSpace($clientSecret)) {
        Write-LogError "[AutoPublish]:Client ID or Client Secret is not set."
        return
    }

    try {
        $authRequestBody = @{
            grant_type = "client_credentials"
            client_id = $clientId
            client_secret = $clientSecret
            audience = $authAudience
        } | ConvertTo-Json

        $authHeaders = @{
            "Content-Type" = "application/json"
        }

        $authResponse = Invoke-RestMethod -Uri $authTokenUrl -Method Post -Body $authRequestBody -Headers $authHeaders -ErrorAction Stop
        $jwtToken = $authResponse.access_token

        if ([string]::IsNullOrWhiteSpace($jwtToken)) {
            Write-LogError "[AutoPublish]:Failed to obtain JWT Token from authentication server."
            return
        }
    }
    catch {
        Write-LogError "[AutoPublish]:Failed to obtain JWT Token - $($_.Exception.Message)"
        return
    }

    # 言語リストの解析
    $languageList = $languages -split "," | ForEach-Object { $_.Trim() }

    # メディアライブラリアイテムの取得
    $contentItem = Get-Item -Path "/sitecore/content" -Database $sourceDatabase
    $mediaLibraryItem = Get-Item -Path "/sitecore/media library" -Database $sourceDatabase

    if (-not $mediaLibraryItem) {
        Write-LogError "[AutoPublish]:Failed to retrieve media library item."
        return
    }

    # Publishing API リクエストボディの構築
    try {
        $requestBody = @{
            name = $jobName
            source = $jobSource
            options = @{
                items = @(
                    @{
                        id = $contentItem.ID.ToString()
                        type = $contentItem.TemplateName
                        publishChildren = $true
                    },
                    @{
                        id = $mediaLibraryItem.ID.ToString()
                        type = $mediaLibraryItem.TemplateName
                        publishChildren = $true
                    }
                )
                xmc = @{
                    locales = $languageList
                    site = @{
                        mode = $publishMode
                    }
                }
            }
            description = "Automated publishing job from AutoPublish script"
        } | ConvertTo-Json -Depth 10

        # Publishing API呼び出し
        $headers = @{
            "Authorization" = "Bearer $jwtToken"
            "Content-Type" = "application/json"
        }
        
        $response = Invoke-RestMethod -Uri $apiEndpoint -Method Post -Headers $headers -Body $requestBody -ErrorAction Stop
    }
    catch {
        Write-LogError "[AutoPublish]:Failed to create publishing job via API - $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $reader.BaseStream.Position = 0
            $responseBody = $reader.ReadToEnd()
            Write-LogError "[AutoPublish]:API Response: $responseBody"
        }
    }
}
catch {
    Write-LogError "[AutoPublish]:Exception occurred - $($_.Exception.Message)"
    Write-LogError $_.Exception.StackTrace
}
finally {
    # END LOG
    Write-LogInfo "END:AutoPublish"
}
