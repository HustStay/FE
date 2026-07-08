$envFile = ".\.env"
if (-Not (Test-Path $envFile)) {
    Write-Host "Loi: Khong tim thay file .env!" -ForegroundColor Red
    exit 1
}

# Đọc IP từ file .env
$targetIp = (Get-Content $envFile | Where-Object { $_ -match "^TARGET_IP=" }).Split("=")[1].Trim()

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Dang cap nhat he thong de su dung IP/Domain:" -ForegroundColor Cyan
Write-Host "$targetIp" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Cập nhật nginx.conf cho cả 3 project
$nginxFiles = @(
    ".\Admin\nginx.conf",
    ".\Customer\nginx.conf",
    ".\Hotel\nginx.conf"
)

foreach ($file in $nginxFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file
        # Cập nhật proxy_pass về API Gateway
        $content = $content -replace "proxy_pass http://.*?:1111/", "proxy_pass http://${targetIp}:1111/"
        # Cập nhật header Host
        $content = $content -replace "proxy_set_header Host .*?;", "proxy_set_header Host ${targetIp};"
        
        Set-Content -Path $file -Value $content -Encoding UTF8
        Write-Host "[x] Đã cập nhật $file" -ForegroundColor Green
    }
}

# 2. Tạo .env cho các project để Vite sử dụng lúc build
$viteEnvContent = @"
VITE_API_GATEWAY_URL=http://${targetIp}:1111
VITE_AI_CHAT_URL=http://${targetIp}:8080
"@

Set-Content -Path ".\Customer\.env" -Value $viteEnvContent -Encoding UTF8
Set-Content -Path ".\Admin\.env" -Value $viteEnvContent -Encoding UTF8
Set-Content -Path ".\Hotel\.env" -Value $viteEnvContent -Encoding UTF8
Write-Host "[x] Đã tạo file .env cho Customer, Admin, Hotel." -ForegroundColor Green

Write-Host ""
Write-Host "Thành công! Vui lòng chạy lệnh sau để áp dụng thay đổi:" -ForegroundColor Yellow
Write-Host "docker compose up -d --build" -ForegroundColor White
