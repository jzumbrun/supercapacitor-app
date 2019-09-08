help:
	@echo ""
	@echo "Welcome to supercapacitor's build command center"
	@echo "----------------------------------------"
	@echo ""
	@echo "help                       Show this list."
	@echo "install                    Install locally."
	@echo ""
	@echo "pack"
	@echo "    pack/dev               Pack the client for development and watch files."
	@echo "    pack/vendor            Pack the client vendor files."
	@echo "    pack/stop              Stop all webpack services."
	@echo ""
	@echo "vagrant"
	@echo "    vagrant/start          Start vagrant."
	@echo "    vagrant/stop           Stop vagrant."
	@echo ""
	@echo "server"
	@echo "    server/restart         Restart the dev server."
	@echo "    server/status          Show pm2 status."
	@echo "    server/logs            Show server logs."
	@echo "    server/clear           Clear all server logs."
	@echo "    server/start           Start the dev server, webpack."
	@echo "    server/stop            Stop the dev server."
	@echo ""
	@echo "code"
	@echo "    code/commit            Pack and commit codez to repo."
	@echo "    code/update            Update supercapacitor module."
	@echo ""
	@echo "----------------------------------------"
	@echo "To get started run: make server/start"
	@echo ""


install:
	@npm install webpack -g
	@make vagrant/start
	@cd ./server && npm ci
	@cd ./client && npm ci
	@make server/start

pack/prod:
	@echo 'Packing production...'
	@cd ./client && webpack --env=production

pack/dev:
	@echo 'Packing development and watching files...'
	@cd ./client && webpack --env=development -w

pack/vendor:
	@echo 'Packing vendor...'
	@cd ./client && webpack --config webpack.dll.js --env=production

pack/stop:
	@echo 'Stopping webpack services...'
	-@killall webpack

vagrant/start:
	@echo 'Starting vagrant...'
	@vagrant up

vagrant/stop:
	@echo 'Stopping vagrant...'
	-@vagrant suspend

server/status:
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 status'

server/logs:
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 log'

server/clear:
	@echo 'Clearing all logs...'
	@echo > ./logs/server.log

server/start: vagrant/start server/restart pack/dev
	@echo 'Dev server started. Visit localhost:7777'

server/restart:
	@echo 'Starting/Restarting express server...'
	@vagrant ssh -c 'cd /var/www/supercapacitor-app && pm2 start dev.json'

server/stop: vagrant/stop pack/stop server/clear
	@echo 'Stopped dev server and related services.'

code/commit: pack/prod
	@git commit -am "$(mess)"
	@git push

code/update:
	@cd ./client && npm install --save supercapacitor
	@make pack/dev
