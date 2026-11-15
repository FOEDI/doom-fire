import { DeskThing } from "@deskthing/server";
import { AppSettings, DESKTHING_EVENTS, SETTING_TYPES } from "@deskthing/types";

const appSettings: AppSettings = {
  fire_speed: {
    id: "fire_speed",
    label: "Fire speed",
    description: "Update interval in milliseconds; lower values are faster.",
    type: SETTING_TYPES.RANGE,
    value: 40,
    min: 15,
    max: 120,
    step: 5,
  },
  wind: {
    id: "wind",
    label: "Wind direction and strength",
    description: "-3 pushes flames left, +3 pushes right, and 0 is calm.",
    type: SETTING_TYPES.RANGE,
    value: 0,
    min: -3,
    max: 3,
    step: 1,
  },
  palette_embers: {
    id: "palette_embers",
    label: "Palette: embers",
    description: "Darkest color in the fire palette.",
    type: SETTING_TYPES.COLOR,
    value: "#000000",
  },
  palette_red: {
    id: "palette_red",
    label: "Palette: red",
    description: "Low flame color.",
    type: SETTING_TYPES.COLOR,
    value: "#b40000",
  },
  palette_orange: {
    id: "palette_orange",
    label: "Palette: orange",
    description: "Middle flame color.",
    type: SETTING_TYPES.COLOR,
    value: "#ff4b00",
  },
  palette_yellow: {
    id: "palette_yellow",
    label: "Palette: yellow",
    description: "Hot flame color.",
    type: SETTING_TYPES.COLOR,
    value: "#ffd000",
  },
  palette_hot: {
    id: "palette_hot",
    label: "Palette: white-hot",
    description: "Hottest color in the fire palette.",
    type: SETTING_TYPES.COLOR,
    value: "#ffffff",
  },
};

const start = async () => {
  await DeskThing.initSettings(appSettings);
};

DeskThing.on(DESKTHING_EVENTS.START, start);