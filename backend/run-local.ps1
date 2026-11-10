param(
  [string]$JavaHome = $env:JAVA_HOME
)

$ErrorActionPreference = "Stop"
$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptRoot

$envFile = Join-Path $scriptRoot ".env"
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
      return
    }
    $parts = $line.Split("=", 2)
    [Environment]::SetEnvironmentVariable($parts[0], $parts[1], "Process")
  }
}

if (-not $JavaHome) {
  $candidate = "C:\Program Files\Java\jdk-24"
  if (Test-Path $candidate) {
    $JavaHome = $candidate
  }
}

if (-not $JavaHome) {
  throw "JAVA_HOME is not set. Install a JDK or pass -JavaHome."
}

$env:JAVA_HOME = $JavaHome
$env:SPRING_PROFILES_ACTIVE = if ($env:SPRING_PROFILES_ACTIVE) { $env:SPRING_PROFILES_ACTIVE } else { "dev" }

.\mvnw.cmd spring-boot:run
