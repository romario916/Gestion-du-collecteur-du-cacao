
export interface ReportPeriod {
  dateDebut: string;
  dateFin: string;
}

export interface PurchaseReport {
  nombreAchats: number;
  quantiteTotaleKg: number;
  montantTotal: number;
}

export interface ProductionReport {
  nombreOperations: number;
  quantiteFraicheUtiliseeKg: number;
  quantiteSecheObtenueKg: number;
  perteTotaleKg: number;
  rendementMoyen: number;
}

export interface SalesReport {
  nombreVentes: number;
  quantiteVendueKg: number;
  chiffreAffaires: number;
  montantEnAttente: number;
}

export interface ExpenseReport {
  nombreDepenses: number;
  montantTotal: number;
  repartitionParCategorie: {
    categorie: string;
    montant: number;
  }[];
}

export interface FinancialReport {
  recettesEncaissees: number;
  depensesValidees: number;
  resultatNet: number;
}
