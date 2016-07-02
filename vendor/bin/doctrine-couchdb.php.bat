@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../doctrine/couchdb-odm/bin/doctrine-couchdb.php
php "%BIN_TARGET%" %*
