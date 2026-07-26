CREATE DATABASE IF NOT EXISTS G_room

USE G_room;

CREATE TABLE Salle (
    id_salle      INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100) NOT NULL,
    capacite      INT NOT NULL,
    equipement    VARCHAR(255), 
    statut        ENUM('libre', 'reservee') NOT NULL DEFAULT 'libre'
);

CREATE TABLE Creneau (
    id_creneau    INT AUTO_INCREMENT PRIMARY KEY,
    jour_semaine  ENUM('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche') NOT NULL,
    heure_debut   TIME NOT NULL,
    heure_fin     TIME NOT NULL,
    id_salle      INT NOT NULL,
    CONSTRAINT fk_creneau_salle
        FOREIGN KEY (id_salle) REFERENCES Salle(id_salle)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT uq_creneau_salle UNIQUE (id_salle)
);

CREATE TABLE Utilisateur (
    id_user           INT AUTO_INCREMENT PRIMARY KEY,
    nom               VARCHAR(100) NOT NULL,
    prenom            VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL UNIQUE,
    password          VARCHAR(255) NOT NULL,
    role              ENUM('enseignant','admin','association','logistique') NOT NULL,
    date_creation     DATE NOT NULL DEFAULT (CURRENT_DATE),
    id_creneau        INT NOT NULL,
    date_attribution  DATE,
    CONSTRAINT fk_utilisateur_creneau
        FOREIGN KEY (id_creneau) REFERENCES Creneau(id_creneau)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE Reservation (
    id_reservation   INT AUTO_INCREMENT PRIMARY KEY,
    date_reservation DATE NOT NULL,
    statut           ENUM('acceptee','refusee','annulee','en_attente') NOT NULL DEFAULT 'en_attente',
    date_creation    DATE NOT NULL DEFAULT (CURRENT_DATE),

    id_user          INT NOT NULL,
    date_demande     DATE NOT NULL,
    commentaire      TEXT,

    id_salle         INT NOT NULL,
    heure_debut      TIME NOT NULL,
    heure_fin        TIME NOT NULL,

    CONSTRAINT fk_reservation_user
        FOREIGN KEY (id_user) REFERENCES Utilisateur(id_user)
        ON UPDATE CASCADE ON DELETE RESTRICT,

    CONSTRAINT fk_reservation_salle
        FOREIGN KEY (id_salle) REFERENCES Salle(id_salle)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE INDEX idx_reservation_salle_date ON Reservation(id_salle, date_reservation);
CREATE INDEX idx_reservation_user ON Reservation(id_user);
CREATE INDEX idx_reservation_statut ON Reservation(statut);
