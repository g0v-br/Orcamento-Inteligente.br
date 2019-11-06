#!/bin/sh
CONFIG_FILE="/usr/share/nginx/html/config.js"
INDEX_FILE="/usr/share/nginx/html/index.html"

#############
## Override a new config file from LODMAP2D_DATA environment variable
#############
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


#############
## Re-Generate a new index.html file from env variables
#############
if [ "$LODMAP2D_LANG" != "" ]; then
	sed -i -r "s^<html lang="en">^<html lang="$LODMAP2D_LANG">^g" "$INDEX_FILE"
fi



if [ "$LODMAP2D_TITLE" != "" ]; then
	sed -i "s^LODMAP2D application^${LODMAP2D_TITLE}^g" "$INDEX_FILE"
fi



if [ "$LODMAP2D_DESCRIPTION" != "" ]; then
	sed -i "s^property="og:description" content=".*"^property="og:description" content="$LODMAP2D_DESCRIPTION"^g" "$INDEX_FILE"
fi



if [ "$LODMAP2D_MATOMO_ID" != "" ]; then
MATOMO_SNIPPET="
<script type="text/javascript">
var _paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
var u="${LODMAP2D_MATOMO_URL:-"https://matomo.app.copernicani.it/"}";
_paq.push(['setTrackerUrl', u+'matomo.php']);
_paq.push(['setSiteId', '$LODMAP2D_MATOMO_ID']);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
</script>
"
MATOMO_SNIPPET=${MATOMO_SNIPPET//$'\n'/} # Remove all newlines.
	sed -i "s^</head>^${MATOMO_SNIPPET}</head>^g" "$INDEX_FILE"
fi



if [ "$LODMAP2D_GA_UA" != "" ]; then
GA_SNIPPET="
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', '$LODMAP2D_GA_UA', 'auto');
ga('send', 'pageview');
</script>
"
GA_SNIPPET=${GA_SNIPPET//$'\n'/} # Remove all newlines.
	sed -i "s^</head>^${GA_SNIPPET}</head>^g" "$INDEX_FILE"
fi




#############
## Run server in foreground
#############
nginx -g "daemon off;"
