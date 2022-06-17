export type hizuke = Date;
export type youbi = "月" | "火" | "水" | "木" | "金" | "土" | "日";
export type kubun = 0 | 1 | 2;
export type syuugyou_basyo = 0 | 1 | 2;
export type kaisi_zikoku = Date;
export type syuuryou_zikoku = Date;
export type kyuukei_zikan = number;
export type sinya_kyuukei = number;
export type zyoukyou = string;
export type rireki = string;
export type bikou = string;
export type tatekaekin = string;

export type Record = {
  hizuke;
  youbi;
  kubun;
  syuugyou_basyo;
  kaisi_zikoku;
  syuuryou_zikoku;
  kyuukei_zikan;
  sinya_kyuukei;
  zyoukyou;
  rireki;
  bikou;
  tatekaekin;
};
export type Records = Record[];
