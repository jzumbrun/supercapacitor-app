help:
	@echo ""
	@echo "Welcome to supercapacitor's build command center"
	@echo "----------------------------------------"
	@echo ""
	@echo "help             Show this list."
	@echo "install          Install locally."
	@echo "pack             Pack the client for production."
	@echo "pack-dev         Pack the client for development and watch files."
	@echo "stop-pack-dev    Stop all webpack services."
	@echo "start-vagrant    Start vagrant."
	@echo "stop-vagrant     Stop vagrant."
	@echo "restart-dev      Restart the dev server."
	@echo "show-status      Show pm2 status."
	@echo "show-logs        Show server logs."
	@echo "clear-logs       Clear all server logs."
	@echo "start-dev        Start the dev server, webpack."
	@echo "stop-dev         Stop the dev server."
	@echo "commit           Pack and commit codez to repo."
	@echo "update           Update supercapacitor module."
	@echo ""
	@echo "----------------------------------------"
	@echo "To get started run: make start-dev"
	@echo ""


install: 
	@make npm install webpack -g
	@make start-vagrant
	@cd ./server && npm ci
	@cd ./client && npm ci
	@make start-dev

pack:
	@echo 'Packing production...'
	@cd ./client && webpack --env=production

pack-dev:
	@echo 'Packing development and watching files...'
	@cd ./client && webpack --env=development -w

stop-pack-dev:
	@echo 'Stopping webpack services...'
	-@killall webpack

start-vagrant:
	@echo 'Starting vagrant...'
	@vagrant up

stop-vagrant:
	@echo 'Stopping vagrant...'
	-@vagrant suspend

show-status:
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 status'

show-logs:
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 log'

clear-logs:
	@echo 'Clearing all logs...'
	@echo > ./logs/server.log

start-dev: start-vagrant restart-dev pack-dev
	@echo 'Dev server started. Visit localhost:7777'

restart-dev:
	@echo 'Starting/Restarting express server...'
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 start dev.json'

stop-dev: stop-vagrant stop-pack-dev clear-logs
	@echo 'Stopped dev server and related services.'

commit: pack
	@git commit -am "$(mess)"
	@git push

update:
	@cd ./client && npm install --save supercapacitor
	@make pack-dev
