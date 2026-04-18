export interface Provincia {
  nome: string;
  municipios: string[];
}

export const PROVINCIAS: Provincia[] = [
  { nome: "Bengo",           municipios: ["Ambriz", "Bula Atumba", "Dande", "Dembos", "Nambuangongo", "Pango Aluquém"] },
  { nome: "Benguela",        municipios: ["Balombo", "Baía Farta", "Benguela", "Bocoio", "Caimbambo", "Catumbela", "Chongorói", "Cubal", "Ganda", "Lobito"] },
  { nome: "Bié",             municipios: ["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Kuito", "Nharea"] },
  { nome: "Cabinda",         municipios: ["Belize", "Buco-Zau", "Cabinda", "Cacongo"] },
  { nome: "Cuando Cubango",  municipios: ["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Longa", "Mavinga", "Menongue", "Nancova", "Rivungo"] },
  { nome: "Cunene",          municipios: ["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"] },
  { nome: "Huambo",          municipios: ["Bailundo", "Caála", "Catchiungo", "Chicala Choloanga", "Chicomba", "Chipindo", "Ecunha", "Huambo", "Londuimbali", "Longonjo", "Mungo", "Ukuma"] },
  { nome: "Huíla",           municipios: ["Caconda", "Caluquembe", "Chibia", "Chicomba", "Chipindo", "Cuvango", "Gambos", "Humpata", "Jamba", "Lubango", "Matala", "Quilengues", "Quipungo"] },
  { nome: "Kwanza Norte",    municipios: ["Ambaca", "Banga", "Bolongongo", "Camba", "Cazengo", "Golungo Alto", "Gonguembo", "Lucala", "Massango", "N'dalatando", "Ngonguembo"] },
  { nome: "Kwanza Sul",      municipios: ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Kibala", "Libolo", "Mussende", "Porto Amboim", "Quibala", "Quilenda", "Seles", "Sumbe"] },
  { nome: "Luanda",          municipios: ["Belas", "Cacuaco", "Cazenga", "Icolo e Bengo", "Kilamba Kiaxi", "Luanda", "Quissama", "Viana"] },
  { nome: "Lunda Norte",     municipios: ["Cambulo", "Capenda Camulemba", "Caungula", "Chitato", "Cuango", "Cuilo", "Lubalo", "Lucapa", "Xá Muteba"] },
  { nome: "Lunda Sul",       municipios: ["Cacolo", "Dala", "Muconda", "Saurimo"] },
  { nome: "Malanje",         municipios: ["Cacuso", "Cambundi Catembo", "Caombo", "Cunda Dia Baza", "Kiwaba Nzoji", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quirima"] },
  { nome: "Moxico",          municipios: ["Alto Zambeze", "Bundas", "Camanongue", "Cameia", "Leua", "Luacano", "Luau", "Luchazes", "Luena"] },
  { nome: "Namibe",          municipios: ["Bibala", "Camucuio", "Moçâmedes", "Tômbwa", "Virei"] },
  { nome: "Uíge",            municipios: ["Alto Cauale", "Ambuíla", "Bembe", "Buengas", "Bungo", "Cassa", "Damba", "Maquela do Zombo", "Milunga", "Mucaba", "Negage", "Puri", "Quimbele", "Quitexe", "Sanza Pombo", "Songo", "Uíge", "Zombo"] },
  { nome: "Zaire",           municipios: ["Cuimba", "M'banza Congo", "Nóqui", "Nzeto", "Soyo", "Tomboco"] },
];

export const BANCOS_ANGOLA = [
  "BAI — Banco Angolano de Investimentos",
  "BFA — Banco de Fomento Angola",
  "BIC — Banco BIC",
  "BCGTA — Banco Caixa Geral Totta de Angola",
  "BDA — Banco de Desenvolvimento de Angola",
  "BPC — Banco de Poupança e Crédito",
  "Millennium Atlântico",
  "SOL — Banco Sol",
  "Standard Bank Angola",
  "Banco Económico",
  "Banco Yetu",
  "Fincred",
];

export function getMunicipios(provincia: string): string[] {
  return PROVINCIAS.find((p) => p.nome === provincia)?.municipios ?? [];
}
