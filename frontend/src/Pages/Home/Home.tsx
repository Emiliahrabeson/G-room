import "./home.css";

const Home = () => {
  // const url1 = "http://localhost:3000/api/salles/nb_salle"
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
        </div>
        <div className="division">
          <p>Réservation aujourd'hui</p>
        </div>
        <div className="division">
          <p>demande en attente</p>
        </div>
        <div className="division">
          <p>Taux d'occupation</p>
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
