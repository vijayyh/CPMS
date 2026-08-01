@echo off
echo =======================================================
echo CPMS Project Setup
echo =======================================================
echo.
echo Installing dependencies...
call pnpm install

echo.
echo Setting up the database...
call pnpm db:push
call pnpm db:generate

echo.
echo Setup complete! Starting the development server...
call pnpm dev
