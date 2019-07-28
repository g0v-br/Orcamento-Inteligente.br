Libreria ldlib
=====================

La libreria ldlib estende la libreria rdflib aggiungendo alcune features:

- dereferenziazione e  ingestion dei dataset 
- gestione automatica della autenticazione tramite webid o basic http auth

rdflib aggiunge la classe *Dereferencer* che si configura come un decoratore della classe fetcher in rdflib.

il costruttore di dereferencer accetta come parametri un fetcher e un array regole di dereferenziazione


## dereferencing rules

Per evitare un accesso eccessivo alla rete dereferencer è in grado di forzare alcune regole di riscrittura degli uri prima di passare alla dereferenziazione standard. Di fatto una implementazione molto semplificata di quanto fa il module "mod_rewrite" di apache.

Tramite la opzione *rules* è possibile indicare al dereferencer un array di regole di riscrittura .  Una regola di riscrittura è composta da due :

- una espressione regolare (*regexp*) che viene applicata all'uri
- un array di template (*targets*) che può riferire gruppi presenti nella regexp. I target sono risorse
da caricare nello store attraverso il fetcher.

Le regole sono valutate in sequenza e solo la prima regola la cui espressione regolare matcha l'uri è applicata. Se nessuna regola è applicabile viene usato direttamente fetcher


Esempio di uso:

```
const $rdf = require(‘ldlib’)
const store  = $rdf.graph();
var timeout = 5000 // 5000 ms timeout
var fetcher = new $rdf.Fetcher(store, timeout)
var dereferencer = new $rdf.Dereferencer( fetcher, [
	{
		"regexp": "https://example.com/(.*)/card" ,
		"target": [ "https://data.example.com/$1.ttl", "https://data.example.com/org.ttl" ]
	}
]);

function exampleCallback (ok, body, xhr) {
    if (!ok) {
        console.log("Oops, something happened and couldn't fetch data");
    } else {
        // do something with the data in the store (see below)
    }
} 

var uri1 = $rdf.sym('http://example.com/alice/card#me');
dereferencer.load( uri1 , exampleCallback)
// loads in the store both resources https://data.example.com/alice.ttl" and  "https://data.example.com/org.ttl"

var uri2 = $rdf.sym('http://example.com/test#me');
dereferencer.load( uri2 , exampleCallback)
// same result as fetcher( uri2 , exampleCallback)

```


## gestione autenticazione


Da discutere:


Se l'accesso ad una delle risorse da caricare produce un error 401, il sistema deve 
chiedere all'utente di loggarsi e poi riprova. Sarebbe ottimo se si capisse se è richiesta
una