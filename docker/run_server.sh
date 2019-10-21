#!/bin/sh
CONFIG_FILE="/usr/share/nginx/html/config.js"

if [ "${LODMAP2D_DATA:0:4}" = "http" ]; then
	echo "(function (window) {window.__dereferencingRules = [" > "$CONFIG_FILE"
	if [ "${LODMAP2D_DATA: -1}" != "/" ]; then
		cat >> "$CONFIG_FILE" <<-CONF	
		    { "regexp": ".*", "targets": ["${LODMAP2D_DATA}"], "isLast": true }	
		CONF
	else
		cat >> "$CONFIG_FILE" <<-CONF
	        { "regexp": ".*", "targets": ['${LODMAP2D_DATA}app.ttl'] },
	        { "regexp": ".*/(table|partition|account).*$", "targets": ['${LODMAP2D_DATA}accounts-index.ttl'] },
	        { "regexp": ".*/table$", "targets": ['${LODMAP2D_DATA}table-view.ttl'], "isLast": true },
	        { "regexp": ".*/partition/(\\\\w+)$", "targets": ['${LODMAP2D_DATA}overview.ttl','${LODMAP2D_DATA}partitions.ttl'], "isLast": true },
	        { "regexp": ".*/account/(\\\\w+)$", "targets": ['${LODMAP2D_DATA}account-view.ttl', "${LODMAP2D_DATA}account/\$1.ttl"], "isLast": true },
	        { "regexp": ".*/(credits|terms)$", "targets": ["${LODMAP2D_DATA}\$1.ttl"], "isLast": true }
		CONF
	fi
	echo "];}(this));" >> "$CONFIG_FILE"
fi

nginx -g "daemon off;"
