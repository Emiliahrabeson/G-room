import * as salleRepositories from "../repositories/salle.repositorie.js";

export async function getListe() {
  const liste = await salleRepositories.getListeSalle();

  return liste;
}

// export async function getNbSalle() {
//   const nb = await salleRepositories.getNbSalle();

//   return nb;
// }

export async function getStatistiques() {
  return await salleRepositories.getStatistiques();
}
