![ldc](http://linkeddata.center/resources/v4/logo/Logo-colori-trasp_oriz-640x220.png)
# LODMAP2D

LODMAP2D is a data driven web application to explore detailed information without loosing the big picture [see overview](http://bit.ly/lodmap2d_p).

LODMAP2D uses the SOLID specifications and the Semantic Web standards to ensure an high level of security and privacy. Data can be centralized in a Knowledge Graph or distributed as Linked Data. LODMAP2D can be easily customized to match a specific data domain. See for example the [Italian Budget](https://budget.g0v.it) produced by the [g0v.it team](https://github.com/gov-it/) and published by the [Copernicani Association](http://copernicani.it)


## Build and run with node

Be sure to have [node](https://nodejs.org) v 12.8+ installed, open a console and type:

```bash
npm install
npm run serve
```

The application will be ready on port 8080

 
## Quick start with docker

The platform is shipped with a [Docker](https://docker.com) setup that makes it easy to get a containerized  environment up and running. If you do not already have Docker on your computer, 
[it's the right time to install it](https://docs.docker.com/install/).

To run build & run LODMAP2D container:

```bash
docker build -t linkeddatacenter/lodmap2d -f docker/Dockerfile .
docker run -d --name lodmap2d -p 8080:80 linkeddatacenter/lodmap2d
```

Try it pointing your browser to http://localhost:8080

Free docker resources with:

```
docker rm -f lodmap2d
```

### Connecting to a custom data source

LODMAP2D renders any linked data resource exposing a [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).

Here is an [example of a BGO resouce](https://linkeddatacenter.github.io/LODMAP-ontologies/v1/bgo/examples/data.ttl).

You can connect LODMAP2D to a data source assigning the environment variable **LODMAP2D_DATA** to a remote file or to a remote api endpoint:

```bash
docker run -d -e LODMAP2D_DATA=http://localhost:8080/data.ttl  --name lodmap2d -p 8080:80 linkeddatacenter/lodmap2d
```

Or run it using a [LODMAP2D-api](https://github.com/linkeddatacenter/LODMAP2D-api) compatible endpoint:

```bash
docker run -d -e LODMAP2D_DATA="http://data.budget.g0v.it/ldp/"  --name lodmap2d -p 8080:80 linkeddatacenter/lodmap2d
```

If the http(s) resource pointed by the LODMAP2D_DATA variable ends with a /, it is supposed to be a LODMAP2D-api compatible endpoint; 
else it is supposed to be a RDF resource (see *Customization* section for more info)

**WARNING: if you connect LODMAP2D to a cross-origin data source, CORS restrictions applies (see the security section above)**



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



The optional parameter *s* allows filtering the displayed objects whose title, description or id contains, even partially, match the parameter value.


## Project Overview

From a conceptual point of view, LODMAP2D is an implementation of a [Bubble Graph Ontology(BGO)](http://linkeddata.center/lodmap-bgo/v1) reasoner.

LODMAP2D implements following additional axioms:

- *bgo:icon*: if its data type is a string, it is considered as the name of an icon in [materialdesignicons.com](https://materialdesignicons.com/) library;
- *bgo:link*: if it is a string, it is considered an route (e.g. "/table" );
- bgo:SubDomain concept is not recognized
- language tags limited support

LODMAP2D reasoner is tolerant towards cardinality errors: i.e. provides default for missing informations and ignores unexpected multiplicity.

From a technical point of view, LODMAP2D is a single page web application (SPA) developed with the [Vue framework](https://vuejs.org/) according to the [SOLID specifications](https://github.com/solid/solid-spec) and based on the [Data Driven Document (d3)](https://d3js.org/) library.

The data model adopts the [Resource Description Framework (RDF)](https://www.w3.org/RDF/) and the [Semantic Web standards](https://www.w3.org/standards/semanticweb/data). 
LODMAP2D recognizes the [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).

The data can be fully distributed. They are fetched by dereferencing the application routes through the rewriting  rules managed by the the src/models/bgolib.js library, that is based on [rdflib.js](https://github.com/linkeddata/rdflib.js/) by Timm Berners Lee & LinkedData friends.


## Security

LODMAP2D is very respectful of users' privacy; it does not use tracking codes and does not use any cookies.

TODO: LODMAP2D supports self signed certificates and  authenticate users with [WebID protocol](https://www.w3.org/wiki/WebID) according SOLID specs. 

Login is required only to access  private data. Unlogged users can always access public data.


### Notes on CORS

LODMAP2D (through rdflib.js) uses a very stringent security pattern to access cross origin data resources. 
Be sure that your data provider is configured to:

- allow access from your host
- allow request method GET
- allow request header 'accept'
- force allowed headers to pre flight response
- set request credentials supported

Any SOLID POD  matches these requirements.

## Customization

### Web App customization

You can override all files in the *public* directory :

- index.html can be customized adding analytics snippets (e.g. Google Analytics), custom css, changing the title and other SEO related parameters.
- the *favicon* and *logos* files can be customized as needed. The preview.png file is used as preview image in social network posts
- IE_alert manages incompatible old browsers.
- the file *config.js* that contains the rules for the data discovery. 
- the file *data.ttl* that contains the ontology to be loaded by the default config.js. 
   
**config.js file format:**

The config.js file contains  the rules that oversee the dereferencing of routes and it is 
inspired by  [Apache mod_rewrite](https://httpd.apache.org/docs/current/rewrite/): 

the *window.__dereferencingRules* global array allows to map routes onto a set of web resources in any way you like.

A rewrite rule is composed of three attributes:

- a regular expression (*regexp*) that is applied to the LODMAP2D route, in case of match the rule is evaluated,
otherwise it is ignored
- an array of strings (*targets*) where each element can contain references (with "$ 1", "$ 2" .. "$ n") to any groups present in the regexp.
- an optional boolean value (*isLast*, default=false) that says if the elaboration of the rules must be considered concluded.

The directory [docs/config-examples](docs/config-examples) contains some example of config.js files


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

For an example of LOADMAP2D customisation see the [web-budget](https://github.com/g0v-it/web-budget) project by [G0V italian team](https://copernicani.it/g0v)


## Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) for the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great javascript framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
