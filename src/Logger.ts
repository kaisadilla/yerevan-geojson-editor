const Logger = {
  trace () {

  },

  debug (kind: LogKind, ...args: any[]) {
    const STYLE_PROPS = "color: white; padding: 2px 4px; border-radius: 3px;";

    let txt = "%cDEBUG | Unknown";
    let style = "background:#aaa;";

    if (kind === 'anim') {
      txt = "%cDEBUG | Anim";
      style = "background:#ff7b00;";
    }
    else if (kind === 'network') {
      txt = "%cDEBUG | Network";
      style = "background:#5c12f3;";
    }

    style += " " + STYLE_PROPS;

    console.debug(txt, style, ...args);
  },

  info (...args: any[]) {
    console.info("Info |", ...args);
  },

  warn (...args: any[]) {
    console.warn("Warn |", ...args);
  },

  error (...args: any[]) {
    console.error("Error |", ...args);
  },

  fatal () {

  },
}

export type LogKind = 'anim'
  | 'network'
  ;

export default Logger;
