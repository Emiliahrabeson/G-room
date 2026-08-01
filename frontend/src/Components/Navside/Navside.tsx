import { Link } from "react-router-dom";

interface Link_title {
  nom: string;
  link: string;
}

const element_link: Link_title[] = [
  { nom: "Tableau de bord", link: "Home" },
  { nom: "Liste des salles", link: "liste" },
  { nom: "Planning", link: "planning" },
  { nom: "Réserver une salle", link: "reservation" },
  { nom: "Demandes en attente", link: "demande" },
  { nom: "Gestion des salles", link: "gestion" },
  { nom: "Statistiques", link: "statistique" },
];

const Navside = () => {
  return (
    <div className="sidebar">
      <div className="app_info">
        <div className="logo">G</div>
        <div className="univ_info">
          <p>G-room</p>
          <p>univ Antananarivo</p>
        </div>
      </div>

      <ul>
        {element_link.map((item) => (
          <li key={item.link}>
            <Link to={item.link}>{item.nom}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navside;
