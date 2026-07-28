DROP DATABASE IF EXISTS G_room;
CREATE DATABASE G_room CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE G_room;

CREATE TABLE utilisateurs (
    id_user         INT AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    prenom          VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('enseignant', 'association', 'logistique', 'admin')
                        NOT NULL DEFAULT 'enseignant',
    statut_compte   ENUM('actif', 'desactive') NOT NULL DEFAULT 'actif',
    date_creation   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_utilisateurs_email UNIQUE (email)
)  ;

CREATE TABLE salles (
    id_salle        INT AUTO_INCREMENT PRIMARY KEY,
    nom             VARCHAR(100) NOT NULL,
    capacite        INT NOT NULL,
    equipements     VARCHAR(255) NULL,          -- ex: "video projecteur, ecran, tableau"
    statut          ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    CONSTRAINT uq_salles_nom UNIQUE (nom),
    CONSTRAINT chk_salles_capacite CHECK (capacite > 0)
)  ;

CREATE TABLE creneaux (
    id_creneau      INT AUTO_INCREMENT PRIMARY KEY,
    heure_debut     TIME NOT NULL,
    heure_fin       TIME NOT NULL,

    CONSTRAINT uq_creneaux_horaire UNIQUE (heure_debut, heure_fin),
    CONSTRAINT chk_creneaux_ordre CHECK (heure_fin > heure_debut)
);

CREATE TABLE reservations (
    id_reservation      INT AUTO_INCREMENT PRIMARY KEY,
    id_user             INT NOT NULL,
    id_salle            INT NOT NULL,
    id_creneau          INT NOT NULL,
    date_reservation    DATE NOT NULL,
    statut              ENUM('confirmee', 'en_attente', 'refusee', 'annulee')
                            NOT NULL DEFAULT 'en_attente',
    commentaire         TEXT NULL,
    date_demande        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_traitement     DATETIME NULL,

    id_salle_slot_actif INT GENERATED ALWAYS AS (
        CASE WHEN statut IN ('confirmee', 'en_attente') THEN id_salle END
    ) STORED,

    CONSTRAINT fk_reservations_user
        FOREIGN KEY (id_user) REFERENCES utilisateurs(id_user)
        ON DELETE CASCADE,
    CONSTRAINT fk_reservations_salle
        FOREIGN KEY (id_salle) REFERENCES salles(id_salle)
        ON DELETE CASCADE,
    CONSTRAINT fk_reservations_creneau
        FOREIGN KEY (id_creneau) REFERENCES creneaux(id_creneau)
        ON DELETE CASCADE,

    CONSTRAINT uq_reservations_slot
        UNIQUE (id_salle_slot_actif, date_reservation, id_creneau)
)  ;

CREATE INDEX idx_reservations_user    ON reservations(id_user);
CREATE INDEX idx_reservations_date    ON reservations(date_reservation);
CREATE INDEX idx_reservations_statut  ON reservations(statut);

INSERT INTO creneaux (heure_debut, heure_fin) VALUES
    ('08:00:00', '10:00:00'),
    ('10:00:00', '12:00:00'),
    ('13:00:00', '15:00:00'),
    ('15:00:00', '17:00:00'),
    ('17:00:00', '19:00:00');