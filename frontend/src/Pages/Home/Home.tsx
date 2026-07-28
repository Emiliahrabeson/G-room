import "./home.css";
import { useState, useEffect } from "react";

const Home = () => {
  const [nb_salle_dispo, setNb_salle_dispo] = useState(0);
  const [reservations_aujourdhui, setReservations_aujourdhui] = useState(0);
  const [demandes_en_attente, setdemandes_en_attente] = useState(0);
  const [taux_occupation, setTaux_occupation] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const url = "http://localhost:3000/api/salles/stats";
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("res.stats:", data);

        setNb_salle_dispo(data.salles_disponibles);
        setReservations_aujourdhui(data.reservations_aujourdhui);
        setdemandes_en_attente(data.demandes_en_attente);
        setTaux_occupation(data.taux_occupation);
      } catch (err) {
        console.error("Erreur du chargement des stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="title_bar">
        <h1>Tableau de bord</h1>
        <p>Vue d'ensemble de l'occupation des salles</p>

        <div className="avatar">RH</div>
      </div>

      <div className="statistique">
        <div className="division">
          <p>Salles disponibles</p>
          <p>{nb_salle_dispo}</p>
        </div>
        <div className="division">
          <p>Réservation aujourd'hui</p>
          <p>{reservations_aujourdhui}</p>
        </div>
        <div className="division">
          <p>demande en attente</p>
          <p>{demandes_en_attente}</p>
        </div>
        <div className="division">
          <p>Taux d'occupation</p>
          <p>{taux_occupation}%</p>
        </div>
      </div>

      <div className="content">
        <h2>Prochaines réservations</h2>
        <table>
          <thead>
            <tr>
              <th>Salle</th>
              <th>Horaire</th>
              <th>Objet</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>B-204</td>
              <td>08h00 - 10h00</td>
              <td>Algorithmique L3</td>
              <td>
                <span className="badge badge-ok">Confirmée</span>
              </td>
            </tr>
            <tr>
              <td>Amphi A</td>
              <td>10h00 - 12h00</td>
              <td>Conférence Design Thinking</td>
              <td>
                <span className="badge badge-ok">Confirmée</span>
              </td>
            </tr>
            <tr>
              <td>C-101</td>
              <td>13h00 - 15h00</td>
              <td>Club Robotique</td>
              <td>
                <span className="badge badge-warn">En attente</span>
              </td>
            </tr>
            <tr>
              <td>B-108</td>
              <td>15h00 - 17h00</td>
              <td>Réseaux L2</td>
              <td>
                <span className="badge badge-ok">Confirmée</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
