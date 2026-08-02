import { Link, useNavigate } from "react-router-dom";
import "./Navside.css";

interface Link_title {
  nom: string;
  link: string;
  roles: string[];
}

const element_link: Link_title[] = [
  {
    nom: "Tableau de bord",
    link: "/home",
    roles: ["enseignant", "association", "logistique", "admin"],
  },
  {
    nom: "Liste des salles",
    link: "/liste",
    roles: ["enseignant", "association", "logistique", "admin"],
  },
  {
    nom: "Planning",
    link: "/planning",
    roles: ["enseignant", "association", "logistique", "admin"],
  },
  {
    nom: "Réserver une salle",
    link: "/reservation",
    roles: ["enseignant", "association"],
  },
  {
    nom: "Demandes en attente",
    link: "/demande",
    roles: ["logistique", "admin"],
  },
  { nom: "Gestion des salles", link: "/gestion", roles: ["admin"] },
  { nom: "Statistiques", link: "/statistique", roles: ["admin"] },
];

const Navside = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const nom = localStorage.getItem("nom");
  const prenom = localStorage.getItem("prenom");

  const liens_visibles = element_link.filter((item) =>
    item.roles.includes(role ?? ""),
  );

  const handleDeconnexion = () => {
    localStorage.clear();
    navigate("/login");
  };

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
        {liens_visibles.map((item) => (
          <li key={item.link}>
            <Link to={item.link}>{item.nom}</Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-foot">
        <br />
        <strong className="me">
          {prenom} {nom}
        </strong>
        <div className="role">{role}</div>
        <button className="btn-deconnexion" onClick={handleDeconnexion}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Navside;
