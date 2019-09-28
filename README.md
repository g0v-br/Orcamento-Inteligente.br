![ldc](http://linkeddata.center/resources/v4/logo/Logo-colori-trasp_oriz-640x220.png)
# LODMAP2D

LODMAP2D is a data driven web application to explore a lot of detailed information without loosing the big picture [see overview](http://bit.ly/lodmap2d_p).

LODMAP2D uses the SOLID specifications and the Semantic Web standards to ensure an high level of security and privacy. Data can be centralized in a Knowledge Graph or distributed as Linked Data. LODMAP2D can be easily customized to match a specific data domain. See for example the [Italian Budget](https://budget.g0v.it) produced by the [g0v.it team](https://github.com/gov-it/) and published by the [Copernicani Association](http://copernicani.it)


## Build and run with node

Be sure to have [node](https://nodejs.org) v 12.8+ installed, open a console and type:

```bash
npm install
npm run serve
```

The application will be ready on port 8080

 
## Build and run with docker

The platform is shipped with a [Docker](https://docker.com) setup that makes it easy to get a containerized  environment up and running. If you do not already have Docker on your computer, 
[it's the right time to install it](https://docs.docker.com/install/).

To run LODMAP2D container directly from dockerhub:

```bash
docker run -d --name lodmap2d -p 8080:80 linkeddatacenter/lodmap2d
```


To build and run LODMAP2D container:

```bash
docker build -t lodmap2d -f docker/Dockerfile .
docker run -d --name lodmap2d -p 8080:80 lodmap2d
```


Try it pointing your browser to http://localhost:8080

Free docker resources with:

```
docker rm -f lodmap2d
```

## Using LODMAP2D



LODMAP2D functions are available from any recent browser by some routes managed directly by the application (i.e. without accessing the network), and in particular:

| route template                | expected behavior                     |
|------------------------------ |-------------------------------------- |
| /                             | redirects to /partition/overview		|
| /partition/overview{?s}       | renders a bgo:Overview subject		|
| /table{?s}                    | renders a bgo:TableView subject		|
| /credits                      | renders a bgo:CreditsView subject		|
| /terms                        | renders a bgo:TermsView subject		|
| /account/{account_id}         | renders a bgo:ProfiledAccount subject	|
| /partition/{partition_id}{?s} | renders any bgo:Partition subject		|



The optional parameter *s* allows filtering the displayed objects whose title,  description or id contains, even partially, match the parameter value.


## Development

From a conceptual point of view LODMAP2D a [Bubble Graph Ontology(BGO)](http://linkeddata.center/lodmap-bgo/v1) browser.

From a technical point of view, LODMAP2D is a single page web application (SPA) developed with the [Vue framework](https://vuejs.org/) according to the [SOLID specifications](https://github.com/solid/solid-spec) and based on the [Data Driven Document (d3)](https://d3js.org/) library.


The data model adopts the [Resource Description Framework (RDF)](https://www.w3.org/RDF/) and the [Semantic Web standards](https://www.w3.org/standards/semanticweb/data). 
LODMAP2D recognizes the [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).

The data can distributed in the network. They are fetched by dereferencing the routes managed internally by the application through the bgolib library, that is based on [rdflib](https://github.com/linkeddata/rdflib.js/) 

In the default configuration, sample data are in the 
[sample.ttl file](public/sample.ttl)

## Security

LODMAP2D is very respectful of users' privacy; it does not use tracking codes and does not use any cookies.

LODMAP2D supports self signed certificates and  authenticate users with [WebID protocol](https://www.w3.org/wiki/WebID) according SOLID specs. 

Login is required only to access  private data. Unlogged users can always access public data.

## Customization

### Web App customization

You can override all files in the *public* directory :

- index.html can be customized adding analytics snippets (e.g. Google Analytics), custom css, changing the title and other SEO related parameters.
- the *favicon* and *logos* files can be customized as needed. The preview.png file is used as preview image in social network posts
- IE_alert manages incompatible old browsers.
   


### Data customization

LODMAP2D is designed to dereference routes (i.e. the process of loading the data related to a route) in two different modes, driven by the environment variable VUE_APP_LODMAP2D_DATA: 

- if such variable does not exist or is empty,  loads data contained in the file /data.ttl ,
- otherwise it assumes  that the variable VUE_APP_LODMAP2D_DATA contains an endpoint that provides the following resources serialized in RDF turtle:

resource | payload
------- | -------------------
*VUE_APP_LODMAP2D_DATA*/app.ttl | common application layout data.
*VUE_APP_LODMAP2D_DATA*/account/*account_id*.ttl  | data for *account_id* account
*VUE_APP_LODMAP2D_DATA*/partition/*partition_id*.ttl  | data for *partition_id* partition
*VUE_APP_LODMAP2D_DATA*/credits.ttl | contains credits data 
*VUE_APP_LODMAP2D_DATA*/terms.ttl | contains terms & conditions data 
*VUE_APP_LODMAP2D_DATA*/accounts.ttl | contains an index of all accounts, including just information used to render account tooltips

For an example of a endpoint see [LODMAP2D-api project](https://github.com/linkeddatacenter/LODMAP2D-api).

When the variable *VUE_APP_LODMAP2D_DATA* is undefined, it is also  possible to write custom configurations, for istance to sues as data provider RESTful APIs, LDP, SPARQL endpoints, etc., etc.
To customize data dereferencing, modify the [config.js](config.js) file.

The config.js file contains the rules  
the rules that oversee the dereferencing of routes
inspired by  [Apache mod_rewrite](https://httpd.apache.org/docs/current/rewrite/): the *dereferencingRules* array allows to map routes onto a set of web resources in any way you like.

A rewrite rule is composed of three attributes:

- a regular expression (* regexp *) that is applied to the LODMAP2D route, in case of match the rule is evaluated,
otherwise it is ignored
- an array of strings (* targets *) where each element can contain references (with "$ 1", "$ 2" .. "$ n") to any groups present in the regexp.
- an optional boolean value (*isLast*, default=false) that says if the elaboration of the rules must be considered concluded.

The dref function in bgolib accepts a LODMAP2D route and evaluates the rewriting rules in sequence creating anarray of resource to be retrived by the rdflib fetcher object.

In the * doc / config * directory you can find some possible config.js examples .

### Using docker to customize LOADMAP2D

Using docker greatly simplify customization activities:

- create an empty directory and copy in it the LOADMAP2D public dir
- apply required modification to the files in your public directory
- create a file named Dockerfile like in [this example](https://gist.github.com/ecow/4a5a22c2ed6b3987043931c3b8355fed)
- build and run your customized docker image:

```bash
docker build -t mylodmap2d .
docker run -d -p 8080:80 mylodmap2d
```

## Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) for the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great javascript framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
