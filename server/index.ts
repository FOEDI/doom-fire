import { DeskThing } from "@deskthing/server";
import { DESKTHING_EVENTS } from "@deskthing/types";

DeskThing.on(DESKTHING_EVENTS.START, () => console.log("Doom Fire started"));
DeskThing.on(DESKTHING_EVENTS.STOP, () => console.log("Doom Fire stopped"));