# Cestopis / Travelbook / Libro de viaje

Right now I'm travelling (or I'm not and I haven't changed this text) and I'm travelling pretty much long time and long way. And I want to create an interactive online "book" about my travel. Basically - lot of unfunny text, some maps, photos, etc. And, here comes this project. 

The main focus of this project are maps - displaying all the way I've made with distinguishing differents types of transport (avion, walking, buses, hitchhiking, rented car, boat). 

Basically, this should work like website generator and the result should be (ideally) without any server-side scripting and with minimum client-side scripting. Just for displaying things that wouldn't work without scripting (maps). 

## How to run it?

* There's no reason to run this right now, as the only few parts works and nothing works well enough. Especially, there is still no export module, just few parts more or less working (or, to be honest, less or lesser working). But, if you would like to run this, you could do it this way:
1. Clone the repo
2. Execute `npm install` in both `private/backend` and `private/frontend` directories
3. Execute `webpack` in `private/frontend` directory (may be needed to install webpack locally and run `npx webpack`)
4. Execute `tsc` in `private/backend` directory (may be needed to install typescript locally and run `npx -p typescript tsc`)
5. Run backend with `node .`
6. Connect with browser to `http://localhost:9080/` (or whatever it shows, it's configurable using `dist/app/const/config.js`)
7. Enjoy the nothingness and nonusefullness of this project!

