[
	{
		"regexp":"bubbles:table" ,
		"tagets": [ 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/accounts.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/common.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/table_view.ttl"
		]
	},
	{
		"regexp":"bubbles:partition" ,
		"tagets": [ 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/accounts.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/common.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/partition_view.ttl"
		]
	},
	{
		"regexp":"bubbles" ,
		"tagets": [ 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/accounts.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/common.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/main_view.ttl"
		]
	},
	{
		"regexp":"account:(.+)" ,
		"tagets": [ 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/account_view.ttl", 
			"https://github.com/linkeddatacenter/LODMAP-ontologies/edit/master/v1/bgo/examples/account/$1.ttl" 
		]
	}
]

