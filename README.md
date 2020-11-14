Introducere

Pentru ca produsul sau serviciul tău să ajungă acolo unde devine cu adevărat folositor, trebuie să înțelegi nevoile și dorințele utilizatorilor și să fii capabil să le rezolvi prin livrarea unui produs potrivit. Aplicația web dezvoltată își propune evaluarea proiectelor studenților prin acordarea notelor cu caracter anonim de către un juriu format din alți studenți. 

Principala nevoie pe care o satisface aplicația este posibilitatea de a primi note ce reflectă opinia altor studenți în legătură cu ideile și implementările celor care au realizat proiectul. De asemenea, această aplicație este utilă din mai multe considerente, cum ar fi: facilitarea vizibilității proiectelor studenților și asigurarea unui mecanism de evaluare centralizat și anonim, opinia obiectivă asupra proiectului în cauză, dar și reflectarea prin note a nivelului studentului. 

Prin aplicatia pe care noi o propunem, utilizatorii isi pot incarca proiectele alaturi de un video demonstrativ, daca este necesar, urmand ca un juriu ales aleator compus tot din studenti care si au incarcat la rândul lor proiectul, vor acorda note, nota finală fiind o medie (excluzând cea mai mare, respectiv cea mai mică notă) a notelor juriului. De asemenea, fiecare membru al juriului poate adăuga comentarii pentru a justifuca nota. Există 2 tipuri de utilizatori ai acestei aplicații, și anume studenți și profesori. Profesorii pot verifica proiectele și vedea nota, însă aceștia nu pot intervenii cu comentarii sau note. 

Aplicația se adresează studenților din cadrul învățământului de tip licență sau cel de tip master ce își doresc îmbunătățirea performanțelor acestora, chiar cu ajutorul colegilor. Prin urmare, se concentrează pe o audiență atât feminină cât și masculină, unui segment de vârsta destul de larg, aparținând de Facultatea de Cibernetică, Statistică și Informatică Economică.

Aplicatii similare in piata: TeamMates (https://teammatesv4.appspot.com/web/front/home)

Roluri: 

Tîrîș Diana-Mihaela – responsabil de proces, programator
Truică Tudor-Alexandru - programator
Țacu Mihaela-Nicoleta– responsabil de produs, programator	




1.Design user interface

                     Vezi pdf

	2. Identify components
	
	1. projects list
2. grade
3. comment
4. account
5. projects details
6. search team

3.Identify API calls

GET accountDetails/:id
PUT accountDetails/:id
PUT changePassword/:id
PUT recoverPassword/:id
POST accountDetails
---------------------------
GET projectsList (best projects - from home page)
---------------------------
GET projectsForEvaluation/:id (the projects that I will evaluate)
----------------------------
GET ourProjects/:teamId
POST ourProject
PUT ourProject/:projId
------------------------
GET grade
PUT grade/:id
------------------------
POST comment
PUT comment/:id
DELETE comment/:id
-------------------------
GET studentProjects
------------------------
GET teamProjects/:teamId
----------------------
GET teamProject/:teamId/project/:id

4. Define user actions
 
1. add,update, delete comments
2. add, update grade
3. submit, update project
4. search team
5. register/login account
6. recover/change pass

	

