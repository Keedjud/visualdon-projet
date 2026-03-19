# visualdon-projet
## Contexte :
Les données utilisées pour ce projet proviennent de sources hétérogènes regroupant des statistiques officielles de Nintendo et de The Pokémon Company, ainsi que des bases de données communautaires.

Origine des données :
* Les chiffres de ventes : [https://www.vgchartz.com/gamedb/games.php?name=pokemon](https://www.vgchartz.com/gamedb/games.php?name=pokemon), [https://www.nintendo.co.jp/ir/en/finance/index.html](https://www.nintendo.co.jp/ir/en/finance/index.html)

* Données de gameplay (Pokémon, types, mécaniques) :
   * API : [https://pokeapi.co/docs/v2](https://pokeapi.co/docs/v2)
   * Sites de référence : [https://www.serebii.net/ ](https://www.serebii.net/), [(https://bulbapedia.bulbagarden.net/wiki/Browse:Video_Games)](https://bulbapedia.bulbagarden.net/wiki/Browse:Video_Games)

* Les notes critiques des jeux : [https://www.metacritic.com/search/pokemon/](https://www.metacritic.com/search/pokemon/)

* Les durées de vies des jeux : [https://howlongtobeat.com/?q=pokemon](https://howlongtobeat.com/?q=pokemon)

* Analyses et statistiques des jeux : [https://www.statista.com/topics/6019/pokemon-gaming/#topicOverview](https://www.statista.com/topics/6019/pokemon-gaming/#topicOverview)

* Contexte de collecte :
Ces données sont collectées depuis 1996 par des passionnés pour documenter la franchise la plus lucrative au monde.

* Biais et absences identifiés :
   * Données de prix : L'inflation n'est pas prise en compte dans les comparaisons historiques sans un ajustement manuel.
   * Absences : Les données précises sur les budgets de développement et la taille des équipes de Game Freak sont rarement publiques, ce qui limite l'analyse de la corrélation "moyens investis vs résultat".

## Description :
Le jeu de données final est une structure multi-table organisée par groupe de version.

* Format : JSON pour les données d'API et pour les données agrégées manuellement (ventes, notes, temps de jeu, etc.).
* Attributs clés :
    * generation INTEGER : Identifiant de la génération (1 à 9).
    * version\_group STRING : Groupe de versions très similaires d'un jeu.
    * game\_type ENUM : Type de jeu (version de base, DLC).
    * sales INTEGER : Nombre de copies vendues.
    * metascore DECIMAL(10, 2) : Note moyenne des critiques (0-100).
    * userscore DECIMAL(10, 2) : Note moyenne des utilisateurs (0-10).
    * new\_pokemon\_count INTEGER : Nombre de nouveaux pokémon.
    * gameplay\_mechanics ENUM : Liste des nouveautés (Méga-Évolution, Dynamax, etc.).
    * playtime\_main\_story DECIMAL(10, 2) : Temps moyen pour finir le jeu (en heures).
    * playtime\_extra DECIMAL(10, 2) : Temps moyen pour finir le jeu + les extras (en heures).
    * playtime\_completion DECIMAL(10, 2) : Temps moyen pour compléter le jeu à 100% (en heures).
    * release_date DATE : Date de sortie (DD/MM/YY).
    * price DECIMAL(10, 2) : Prix du jeu.
    * console VARCHAR : La console qui supporte le jeu
    * patch-count INTEGER : Nombre de patches post-lancement
    * games_releases INTEGER : Nombre de jeux pokémons sortis la même année

## But :
Ce projet adopte une approche hybride : **explorative** et **explicative**.

**L'Histoire que nous racontons**

Nous voulons raconter l'histoire d'un géant qui avance à petits pas. Le récit, conçu sous forme de scrollytelling, guide l'utilisateur à travers les décennies pour lui faire réaliser le paradoxe de Pokémon : une popularité qui explose face à une stagnation critique et technique perçue par une partie de la communauté.

**Notre regard sur les données**

Nous portons un regard critique mais nuancé. L'objectif est de démontrer objectivement que si la licence évolue (nouveaux types, passage à la 3D, monde ouvert), cette progression est parfois déconnectée des standards technologiques de l'industrie. Nous voulons transformer le "ressenti" du joueur en "constat" visuel : l'évolution est réelle, mais son rythme interroge.

## Références :

* Analyse/Avis d'un joueur sur la licence Pokemon : [https://www.youtube.com/watch?v=dSlgJ5JjV6w](https://www.youtube.com/watch?v=dSlgJ5JjV6w)

* Analyse/Avis de l'évolution du graphisme : [https://www.youtube.com/watch?v=Ihk3dYPLfcs](https://www.youtube.com/watch?v=Ihk3dYPLfcs)

* Analyse/Avis sur les changements entre chaque génération Pokémon : [https://www.youtube.com/watch?v=S7HCfhWfd8Q](https://www.youtube.com/watch?v=S7HCfhWfd8Q)
