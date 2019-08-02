![ldc](http://linkeddata.center/resources/v4/logo/Logo-colori-trasp_oriz-640x220.png)
# LODMAP2D

LODMAP2D is a data driven web application to explore a lot of detailed information without loosing the big picture [see overview](http://bit.ly/lodmap2d_p).

LODMAP2D uses the SOLID specifications and the Semantic Web standards to ensure an high level of security and privacy. Data can be centralized in a Knowledge Graph or distributed as Linked Data. LODMAP2D can be easily customized to match a specific data domain. See for example the [Italian Budget](https://budget.g0v.it) produced by the [g0v.it team](https://github.com/gov-it/) and published by the [Copernicani Association](http://copernicani.it)


## Build and run with node

Be sure to have [node](https://nodejs.org) installed, open a console and type:

```bash
npm install
npm run serve
```

The application will be ready on port 8080

 
## Build and run with docker

The platform is shipped with a [Docker](https://docker.com) setup that makes it easy to get a containerized development environment up and running. 
If you do not already have Docker on your computer, 
[it's the right time to install it](https://docs.docker.com/install/).

To build and run LODMAP2D container:

```bash
docker build -t lodmap2d .
docker run -d --name lodmap2d -p 8080:8080 lodmap2d
```

Try it pointing your browser to http://localhost:8080

Free docker resources with:

```
docker rm -f lodmap2d
```

## Usare LODMAP2D

LODMAP2D può essere pensato come un browser semantico in grado di riconoscerealcuni concetti descritti
nella [Bubble Graph Ontology(BGO)](http://linkeddata.center/lodmap-bgo/v1)

Le funzioni di LODMAP2D sono richiamabili da un browser di nuova generazione richiamando un URL seguito da alcune rotte gestite direttamente dalla applicazione (i.e. senza accedere alla rete), ed in particolare:

| url template | azione |
|------------- |------- |
| /{?s} | renderizza un soggetto di tipo bgo:Overview  |
| /table{?s} | renderizza un soggetto di tipo bgo:TableView  |
| /credits | renderizza un soggetto di tipo bgo:CreditsView |
| /terms | renderizza un soggetto di tipo bgo:TermsView |
| /account/{account_id} | renderizza un soggetto di tipo bgo:ProfiledAccount |
| /partition/{partition_id}{?s} | renderizza un soggetto di tipo bgo:Partition |


Il parametro opzionale  *s* permette di filtrare nella visualizzazione gli oggetti il cui titolo, la cui descrizione o la cui id contiene, anche parzialmente, la stringa passata come valore al parametro.


## Development

Dal punto di vista tecnico, LODMAP2D è una single page application sviluppata nel framework [Vue](https://vuejs.org/) in accordo alle specifiche [SOLID](https://github.com/solid/solid-spec) basata sulla la libreria [Data Driven Document (d3)](https://d3js.org/)

Il modello dei dati adotta il [Resource Description Framework (RDF)](https://www.w3.org/RDF/) e gli standard del [Semanitic Web](https://www.w3.org/standards/semanticweb/data). 
In particolare LODMAP2D in grado di riconoscere dati espressi con la [Bubble Graph Ontology](http://linkeddata.center/lodmap-bgo/v1).

I dati sono ottenuti attraverso una dereferenziazione delle rotte gestite internamente dalla applicazione attraverso la libreria bgolib, che estende la libreria [rdflib](https://github.com/linkeddata/rdflib.js/)

Nella configurazione di default i dati di esempio sono contenuti nel file 
[sample.ttl](public/sample.ttl)

## Security

LODMAP2D è molto rispettosa della privacy degli utenti, non utilizza nessun codice di tracciamento e non usa alcun cookie.

Se le risorse dereferenziate lo richiedono, LODMAP2D si autentica utizzando il [WebID](https://www.w3.org/wiki/WebID) che l'utente specifica in fase di login. La login è necessaria solo
per accedere a dati riservati e per funzioni future, non è necessaria per accedere a dati pubblici.

Se l'utente non è autenticato, i dati non accessibili sono ignorati.

## Personalizzazioni

### Personalizzazione della applicazione

E' possibile personalizzare l'applicazione sovrascrivendo i file contenuti nella directory public:

- il file index.html può essere personalizzato per inserire snippet di tracciamento (es. google analytics) o css privati, per modificare il titolo della applicazione e altri parametri per il SEO.
- i file favicon* possono essere modificati a piacere così come i loghi
- il file preview.png è usato come immagine di riferimento nei social
- il file IE_alert gestisce l'alert visualizzato a fronte di un browser non compatibile
   
L'utilizzo di docker semplifica enormemente le attività di personalizzazione. Vedi un esempio nel progetto https://github.com/g0v-it/web-budget.


### Personalizzazione dei dati

LODMAP2D è predisposto per dereferenziare le rotte (ovvero caricare i dati necessari a visualizzare una rotta) in due modalità differenti, pilotabile dalla variabile di ambiente LODMAP2D_DATA: se la variabile non esiste o è vuota, sono caricati dei dati di test, altrimenti si assume che la variabile LODMAP2D_DATA contenga un endpoint che fornisca le seguenti risorse serializzato in RDF turtle:

risorsa | contenuto ritornato
------- | -------------------
*LODMAP2D_DATA*/app.ttl | contiene dati relativi ai menu utilizzati da tutte le rotte.
*LODMAP2D_DATA*/account/*account_id*  | contiene i dati relativi all'account *account_id*
*LODMAP2D_DATA*/partition/*partition_id*  | contiene i dati specifici relativi alla partizione *partition_id*
*LODMAP2D_DATA*/credits.ttl | contiene i dati specifici alla rotta /credits
*LODMAP2D_DATA*/terms.ttl | contiene i dati  specifici alla rotta /terms 
*LODMAP2D_DATA*/accounts.ttl | contiene un indice di tutte gli account, includendo solo
le un subset delle informazioni presenti in dettaglio anche nei file della directory account 
*LODMAP2D_DATA*/overview.ttl | contiene  dati  specifici alla rotta principale (/)

Ricompilando l'applicazione, è possibile utilizzare altre configurazioni (usando risorse RestFUL, LDP, SPARQL endpoints, etc., etc.) ottenibili modificando il file [config.js](config.js)

Il file [config.js](config.js) contiene le regole che sovraintendono alla dereferenziazione delle rotte
e sono inspirate al [Apache mod_rewrite](https://httpd.apache.org/docs/current/rewrite/); in particolare l'array *dereferencingRules* permette di map routes onto a set of web resources in any way you like.


Una regola di riscrittura è composta da tre attributi:

- una espressione regolare (*regexp*) che viene applicata all'uri, in caso di match la regla viene valutata.
- un array di stringhe (*targets*) in cui ciascun elemento può contenere riferimenti (con "$1", "$2".."$n") a eventuali gruppi presenti nella regexp. 
- un valore booleano (*isLast*) che dice se 'elaborazione delle regole deve considerarsi conclusa.

Le regole sono valutate in sequenza. Se nessuna regola è applicabile viene usato il metodo standard di dereferenziazione degli uri come implementato da rdflib.
Quando una regola è applicabile i valori di eventuali gruppi sono espansi nei target e i valori risultanti sono aggiunti ad un array di risorse che verranno caricate dalla rete.

Nella directory *doc/config* è possibile trovare alcuni esempi di di configurazione più articolati che consentono all'applicazione di usare dati da sorgenti esterni all'applicazione.

# Thanks

- [Enrico Fagnoni](https://github.com/ecow),[Miah Mohd Ehtesham](https://github.com/miahmohd), [Leonardo Longhi](https://github.com/LeonardoLonghi) and [Yassine Ouahidi](https://github.com/YassineOuahidi) the webapp code design.
- The [D3.js library](https://d3js.org/)
- [Evan You](http://evanyou.me/) and the [Vue community](https://vuejs.org) for the great framework
- TimBL & LinkedData team for SOLID and [rdflib project](https://github.com/linkeddata/rdflib.js)

## License

Please see [License File](LICENSE) for more information.
