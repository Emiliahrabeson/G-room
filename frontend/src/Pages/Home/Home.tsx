const Home = () => {
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
        <div className="division">demande en attente</div>
        <div className="division">
          <p>Taux d'occupation</p>
        </div>
      </div>

      <div className="content">
        <h2>Prochaines réservations</h2>
        <table></table>
      </div>
    </>
  );
};

export default Home;
