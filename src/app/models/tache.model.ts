export enum PrioriteTache {
  Elevee ,
  Moyenne ,
  Faible 
}

export enum EtatTache {
  A_FAIRE,
  EN_COURS ,
  TERMINE 
}

export interface Tache {
  id: number; 
  titre: string;
  date_debut: string;
  date_fin: string; 
  etat: EtatTache;
  priorite: PrioriteTache;
  etudiant_id: number;
} 