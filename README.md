# visualdon-projet
## Contexte :
Les données utilisées pour ce projet proviennent de sources hétérogènes regroupant des statistiques officielles de Nintendo et de The Pokémon Company, ainsi que des bases de données communautaires.

Origine des données :
* Les chiffres de ventes : [https://www.vgchartz.com/gamedb/games.php?name=pokemon](https://www.vgchartz.com/gamedb/games.php?name=pokemon), [https://www.nintendo.co.jp/ir/en/finance/index.html](https://www.nintendo.co.jp/ir/en/finance/index.html)

* Données de gameplay (Pokémon, types, mécaniques) :
API : [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)
Sites de référence : [https://www.serebii.net/ ](https://www.serebii.net/), [(https://bulbapedia.bulbagarden.net/wiki/Browse:Video_Games)](https://bulbapedia.bulbagarden.net/wiki/Browse:Video_Games)

* Les notes critiques des jeux : [https://www.metacritic.com/search/pokemon/](https://www.metacritic.com/search/pokemon/)

* Les durées de vies des jeux : [https://howlongtobeat.com/?q=pokemon](https://howlongtobeat.com/?q=pokemon)

* Analyses et statistiques des jeux : [https://www.statista.com/topics/6019/pokemon-gaming/#topicOverview](https://www.statista.com/topics/6019/pokemon-gaming/#topicOverview)

* Contexte de collecte :
Ces données sont collectées depuis 1996 par des passionnés pour documenter la franchise la plus lucrative au monde.

Biais et absences identifiés :
    * Subjectivité des notes : Les notes des critiques (Metacritic) ne reflètent pas toujours l'expérience du joueur final.
    * Données de prix : L'inflation n'est pas toujours prise en compte dans les comparaisons historiques sans un ajustement manuel.
    * Absences : Les données précises sur les budgets de développement et la taille des équipes de Game Freak sont rarement publiques, ce qui limite l'analyse de la corrélation "moyens investis vs résultat".

## Description :
Le jeu de données final est une structure multi-table organisée par génération (de la 1ère à la 9ème).

* Format : JSON pour les données d'API et pour les données agrégées manuellement (ventes, notes).
* Attributs clés :
    * generation : Identifiant de la période (1 à 9).
    * sales\_units : Nombre de copies vendues.
    * metascore : Note moyenne des critiques (0-100).
    * userscore : Note moyenne des utilisateurs (0-10).
    * new\_pokemon\_count : Nombre de nouvelles créatures.
    * gameplay\_mechanics : Liste des nouveautés (Méga-Évolution, Dynamax, etc.).
    * playtime\_main\_story : Temps moyen pour finir le jeu (en heures).
    * playtime\_extra : Temps moyen pour finir le jeu + les extras (en heures).
    * playtime\_completion : Temps moyen pour compléter le jeu à 100% (en heures).
    * release_date : Date de sortie
    * price : Prix du jeu
    * price_total : Prix total du jeu avec DLC
    * patch-count : Nombre de patches post-lancement
    * games_releases : Nombre de jeux pokémons sortis la même année

## But :
Ce projet adopte une approche hybride : **explorative** et **explicative**.

**L'Histoire que nous racontons**

Nous voulons raconter l'histoire d'un géant qui avance à petits pas. Le récit, conçu sous forme de scrollytelling, guide l'utilisateur à travers les décennies pour lui faire réaliser le paradoxe de Pokémon : une popularité qui explose (ventes record) face à une stagnation critique et technique perçue par une partie de la communauté.

**Notre regard sur les données**

Nous portons un regard critique mais nuancé. L'objectif est de démontrer objectivement que si la licence évolue (nouveaux types, passage à la 3D, monde ouvert), cette progression est parfois déconnectée des standards technologiques de l'industrie. Nous voulons transformer le "ressenti" du joueur en "constat" visuel : l'évolution est réelle, mais son rythme interroge.

## Références :

* Analyse/Avis d'un joueur sur la licence Pokemon : [https://www.youtube.com/watch?v=dSlgJ5JjV6w](https://www.youtube.com/watch?v=dSlgJ5JjV6w)

* Analyse/Avis de l'évolution du graphisme : [https://www.youtube.com/watch?v=Ihk3dYPLfcs](https://www.youtube.com/watch?v=Ihk3dYPLfcs)

* Analyse/Avis sur les changements entre chaque génération Pokémon : [https://www.youtube.com/watch?v=S7HCfhWfd8Q](https://www.youtube.com/watch?v=S7HCfhWfd8Q)
