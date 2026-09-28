-- Plantéis oficiais da Liga Unitel Girabola 2026/2027 (FIFA Connect / MA ID).
-- Gerado por scripts/generate-squad-sql.mjs a partir de official-squads-2026-27.ts.
-- Tabelas dedicadas girabola_*, independentes das tabelas ancaf_* do site.

begin;

create table if not exists public.girabola_clubs (
  id            text primary key,
  name          text not null,
  official_name text,
  short_name    text,
  city          text,
  stadium       text,
  founded       integer,
  nickname      text,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);

create table if not exists public.girabola_players (
  id            text primary key,            -- MA ID
  club_id       text not null references public.girabola_clubs(id) on delete cascade,
  name          text not null,
  full_name     text,
  popular_name  text,
  ma_id         text not null,
  fifa_id       text,
  gender        text,
  birth_date    date,
  nationality   text,
  position      text,                        -- GK / DF / MF / FWD (código FIFA) ou null
  jersey_number integer,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);
create index if not exists girabola_players_club_idx on public.girabola_players(club_id);

create table if not exists public.girabola_staff (
  id            text primary key,            -- MA ID
  club_id       text not null references public.girabola_clubs(id) on delete cascade,
  name          text not null,
  full_name     text,
  popular_name  text,
  ma_id         text not null,
  fifa_id       text,
  gender        text,
  role          text,                        -- TMGR / ASCH / GKCH / PHYS / TMED / HDCH / ...
  nationality   text,
  created_at    timestamptz not null default timezone('utc', now()),
  updated_at    timestamptz not null default timezone('utc', now())
);
create index if not exists girabola_staff_club_idx on public.girabola_staff(club_id);

-- Clubes
insert into public.girabola_clubs (id, name, official_name, short_name, city, stadium, founded, nickname)
values
  ('primeiromaio', 'Estrela 1.º de Maio', 'Estrela Clube Primeiro de Maio', 'MAI', 'Benguela', 'Estádio Municipal', 1981, 'Proletários'),
  ('wiliete', 'Wiliete de Benguela', 'Wiliete Sport Clube de Benguela', 'WIL', 'Benguela', 'Estádio Nacional de Ombaka', 2018, 'Wilietes'),
  ('desphuila', 'Desportivo da Huíla', 'Clube Desportivo da Huíla', 'CDH', 'Lubango', 'Estádio da Tundavala', 1998, 'Huilanos'),
  ('dago', 'CD 1.º de Agosto', 'Clube Desportivo 1.º de Agosto', '1AG', 'Luanda', 'Estádio França Ndalu', 1977, "D' Agosto"),
  ('kabuscorp', 'Kabuscorp SC', 'Kabuscorp Sport Clube do Palanca', 'KAB', 'Luanda', 'Estádio 22 de Junho', 1994, 'Palanquinos'),
  ('lobito', 'Académica do Lobito', 'Académica Petróleos Clube do Lobito', 'ACA', 'Lobito', 'Estádio da Tundavala', 1970, 'Estudantes'),
  ('fcluanda', 'FC Luanda', 'Futebol Clube de Luanda', 'FCL', 'Luanda', 'Estádio França Ndalu', 2020, 'Luandenses'),
  ('libolo', 'Recreativo do Libolo', 'Clube Recreativo e Desportivo do Libolo', 'CRL', 'Calulo', 'Estádio Municipal de Calulo', 1942, 'Libolenses'),
  ('caala', 'CR Caála', 'Clube Recreativo da Caála', 'CRC', 'Huambo', 'Estádio Daniel Cassoma Lutucuta', 1944, 'Caalenses'),
  ('interclube', 'GD Interclube', 'Grupo Desportivo Interclube', 'INT', 'Luanda', 'Estádio 22 de Junho', 1976, 'Polícias'),
  ('bravos', 'Bravos do Maquis', 'Futebol Clube Bravos do Maquis', 'BMQ', 'Luena', 'Estádio Mundunduleno', 1983, 'Maquisardes'),
  ('sagrada', 'Sagrada Esperança', 'Clube Desportivo Sagrada Esperança', 'SAG', 'Dundo', 'Estádio Sagrada Esperança', 1976, 'Lundas'),
  ('lundasul', 'Desportivo da Lunda Sul', 'Clube Desportivo da Lunda-Sul', 'DLS', 'Saurimo', 'Estádio Sagrada Esperança', 2020, 'Tchianda'),
  ('saosalvador', 'São Salvador', 'São Salvador do Kongo Futebol Clube', 'SSK', 'Mbanza Kongo', 'Estádio Álvaro Buta', 1999, 'Kongos'),
  ('petro', 'Petro de Luanda', 'Atlético Petróleos de Luanda', 'APL', 'Luanda', 'Estádio 11 de Novembro', 1980, 'Tricolores'),
  ('cabinda', 'FC Cabinda', 'Futebol Clube de Cabinda', 'FCC', 'Cabinda', 'Estádio Vici António', 2005, 'Gorilas do Norte')
on conflict (id) do update set
  name = excluded.name, official_name = excluded.official_name, short_name = excluded.short_name,
  city = excluded.city, stadium = excluded.stadium, founded = excluded.founded,
  nickname = excluded.nickname, updated_at = timezone('utc', now());

-- Estrela 1.º de Maio — 28 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000568M00', 'primeiromaio', 'DIMONIQUENE KAPEMBE SEGUNDA BONGUE', 'DIMONIQUENE KAPEMBE SEGUNDA BONGUE', null, '000568M00', '1JXIB83', 'MALE', '2000-04-19', 'Angola', 'DF', 13),
  ('000457M96', 'primeiromaio', 'Deco', 'MOISÉS ALBERTO CALEPI', 'Deco', '000457M96', '1JSRCP9', 'MALE', '1996-12-31', 'Angola', 'FWD', 9),
  ('002433M96', 'primeiromaio', 'DANIEL CHACULEMBA', 'DANIEL CHACULEMBA', null, '002433M96', '1LSUTX8', 'MALE', '1996-07-25', 'Angola', 'DF', 28),
  ('001067M01', 'primeiromaio', 'Muila Lengo Congolo', 'Muila Lengo Congolo', null, '001067M01', '1K2PEY7', 'MALE', '2001-04-25', 'Angola', 'MF', 16),
  ('002775M03', 'primeiromaio', 'Miguel Agostinho Dey', 'Miguel Agostinho Dey', null, '002775M03', '1M9IBY1', 'MALE', '2003-08-25', 'Angola', 'DF', 2),
  ('000873M02', 'primeiromaio', 'MOISES MBUTA DOMINGOS', 'MOISES MBUTA DOMINGOS', null, '000873M02', '1K1HKV2', 'MALE', '2002-07-18', 'Angola', 'DF', 5),
  ('002898M04', 'primeiromaio', 'VICENTE DOMINGOS', 'VICENTE DOMINGOS', null, '002898M04', '1MALEZ5', 'MALE', '2004-01-20', 'Angola', 'MF', 34),
  ('002162M00', 'primeiromaio', 'Fernando Mateus Duarte Duarte', 'Fernando Mateus Duarte Duarte', null, '002162M00', '1LJH1X4', 'MALE', '2000-02-28', 'Angola', 'FWD', 20),
  ('001258M01', 'primeiromaio', 'Luis Simoes Escovalo', 'Luis Simoes Escovalo', null, '001258M01', '1KZTK20', 'MALE', '2001-02-06', 'Angola', 'MF', 19),
  ('003470M02', 'primeiromaio', 'SIMÃO CULECA GONGA', 'SIMÃO CULECA GONGA', null, '003470M02', '1NB4BP9', 'MALE', '2002-01-16', 'Angola', 'MF', 22),
  ('003465M99', 'primeiromaio', 'TADEU NUMBI DA SILVA JAKE', 'TADEU NUMBI DA SILVA JAKE', null, '003465M99', '1NAVZJ4', 'MALE', '1999-05-31', 'Angola', 'MF', 3),
  ('003082M02', 'primeiromaio', 'Odenir Tavares Pereira Jorge', 'Odenir Tavares Pereira Jorge', null, '003082M02', '1MQVBD5', 'MALE', '2002-06-06', 'Angola', 'MF', 14),
  ('001177M03', 'primeiromaio', 'Avelino Mussili Kassanhica', 'Avelino Mussili Kassanhica', null, '001177M03', '1KF4F49', 'MALE', '2004-05-21', 'Angola', 'FWD', 29),
  ('000629M86', 'primeiromaio', 'MÁRCIO ARMANDO GONÇALVES LUVAMBO', 'MÁRCIO ARMANDO GONÇALVES LUVAMBO', null, '000629M86', '1JYN4K6', 'MALE', '1986-03-04', 'Angola', 'DF', 7),
  ('000848M96', 'primeiromaio', 'Rodrigues Muehombo', 'Rodrigues Muehombo', null, '000848M96', '1K176E0', 'MALE', '1996-05-13', 'Angola', 'MF', 8),
  ('000644M00', 'primeiromaio', 'PAULO BALACA MUTOSSI', 'PAULO BALACA MUTOSSI', null, '000644M00', '1JZ4J23', 'MALE', '2000-02-19', 'Angola', 'DF', 24),
  ('000942M00', 'primeiromaio', 'ANTÓNIO PASCOAL', 'ANTÓNIO PASCOAL', null, '000942M00', '1K1SG53', 'MALE', '2000-04-15', 'Angola', 'GK', 1),
  ('000642M97', 'primeiromaio', 'ANTÓNIO LUCAMBA PESSELA', 'ANTÓNIO LUCAMBA PESSELA', null, '000642M97', '1JZ4FG4', 'MALE', '1997-03-18', 'Angola', 'DF', 26),
  ('001589M99', 'primeiromaio', 'ANTONIO LENDE TCHIMUKU', 'ANTONIO LENDE TCHIMUKU', null, '001589M99', '1L96AR2', 'MALE', '1999-02-02', 'Angola', 'GK', 99),
  ('003471M02', 'primeiromaio', 'JOAQUIM KANHIHI TCHINGOMBE', 'JOAQUIM KANHIHI TCHINGOMBE', null, '003471M02', '1NB4DQ1', 'MALE', '2002-02-02', 'Angola', 'GK', 56),
  ('003468M02', 'primeiromaio', 'FRANCISCO NGALANGUI TCHITANE', 'FRANCISCO NGALANGUI TCHITANE', null, '003468M02', '1NB49X0', 'MALE', '2002-07-20', 'Angola', 'DF', 33),
  ('000747M00', 'primeiromaio', 'JOSE MARCOS PEREIRA TCHIVINGA', 'JOSE MARCOS PEREIRA TCHIVINGA', null, '000747M00', '1K0C7S4', 'MALE', '2000-03-03', 'Angola', 'DF', 15),
  ('000676M91', 'primeiromaio', 'GELSON TELES', 'GELSON TELES', null, '000676M91', '1JZJEU2', 'MALE', '1991-07-23', 'Angola', 'MF', 18),
  ('000565M01', 'primeiromaio', 'ELISEU ANTÓNIO BORGES VARELA', 'ELISEU ANTÓNIO BORGES VARELA', null, '000565M01', '1JXHXL1', 'MALE', '2001-07-27', 'Angola', 'MF', 6),
  ('001189M03', 'primeiromaio', 'Moises Maquico Lua', 'Moises Maquico Lua', null, '001189M03', '1KF4IX9', 'MALE', '2003-01-24', 'Angola', 'MF', 37),
  ('005558M04', 'primeiromaio', 'DAMIÃO RAIMUNDO NICOLAU', 'DAMIÃO RAIMUNDO NICOLAU', null, '005558M04', '1QF49D2', 'MALE', '2004-05-10', 'Angola', 'DF', 4),
  ('003535M02', 'primeiromaio', 'KIJUNGU KITUMBA FRANCISCO', 'KIJUNGU KITUMBA FRANCISCO', null, '003535M02', '1ND4NN2', 'MALE', '2002-05-17', 'Angola', 'MF', 25),
  ('000923M00', 'primeiromaio', 'MALEBANI RABBY', 'MALEBANI RABBY', null, '000923M00', '1K1M4E0', 'MALE', '2000-07-26', 'Angola', 'FWD', 31)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Wiliete de Benguela — 32 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000647M02', 'wiliete', 'JOÃO VALONGA BASILIO BARROS', 'JOÃO VALONGA BASILIO BARROS', null, '000647M02', '1JZ4N21', 'MALE', '2002-02-21', 'Angola', 'DF', 26),
  ('000320M00', 'wiliete', 'AUGUSTO MANUEL BALSA', 'AUGUSTO MANUEL BALSA', null, '000320M00', '1JJFIJ0', 'MALE', '2000-05-06', 'Angola', 'DF', 15),
  ('002281M98', 'wiliete', 'SILVA HINÁRIO ANTÓNIO', 'SILVA HINÁRIO ANTÓNIO', null, '002281M98', '1LJZ6E0', 'MALE', '1998-02-10', 'Angola', 'DF', 3),
  ('007235M02', 'wiliete', 'Lukman Idowu Bello', 'Lukman Idowu Bello', null, '007235M02', '1SN8AC3', 'MALE', '2002-10-03', 'Democratic Republic of the Congo', 'FWD', 18),
  ('000401M04', 'wiliete', 'ARMINDO GONÇALVES CANJI', 'ARMINDO GONÇALVES CANJI', null, '000401M04', '1JRU7C5', 'MALE', '2004-10-18', 'Angola', 'MF', 10),
  ('008144M06', 'wiliete', 'Carlos Cassissi', 'Carlos Cassissi', null, '008144M06', '1UQNV32', 'MALE', '2006-05-03', 'Angola', 'MF', 24),
  ('000544M99', 'wiliete', 'GIOVANI CHIPOPOLO', 'GIOVANI CHIPOPOLO', null, '000544M99', '1JWU6Z0', 'MALE', '1999-10-03', 'Angola', 'DF', 17),
  ('001123M99', 'wiliete', 'ANTÓNIO MULE CHITONGO', 'ANTÓNIO MULE CHITONGO', null, '001123M99', '1K39NK6', 'MALE', '1999-06-08', 'Angola', 'MF', 8),
  ('000888M00', 'wiliete', 'Francisco Cubuema Matoco', 'Francisco Cubuema Matoco', null, '000888M00', '1K1JSJ8', 'MALE', '2000-02-14', 'Angola', 'MF', 16),
  ('000325M91', 'wiliete', 'ELBER DELGADO', 'ELBER DELGADO', null, '000325M91', '1JM7Y97', 'MALE', '1991-06-24', 'Cabo Verde', 'GK', 31),
  ('003650M05', 'wiliete', 'FILOMENO PINHEIRO ALBERTO GILOSO', 'FILOMENO PINHEIRO ALBERTO GILOSO', null, '003650M05', '1NI87H8', 'MALE', '2005-07-27', 'Angola', 'FWD', 21),
  ('004505M99', 'wiliete', 'Nayan Gomes', 'Nayan Gomes', null, '004505M99', '1PKWT84', 'MALE', '1999-12-11', 'Brazil', 'GK', 1),
  ('001110M03', 'wiliete', 'Cesar Cangui Uvi Jeremias', 'Cesar Cangui Uvi Jeremias', null, '001110M03', '1K36HF0', 'MALE', '2003-05-03', 'Angola', 'FWD', 34),
  ('000540M95', 'wiliete', 'RODINO DUMBO JOSE', 'RODINO DUMBO JOSE', null, '000540M95', '1JWU0L8', 'MALE', '1995-09-20', 'Angola', 'FWD', 25),
  ('004709M98', 'wiliete', 'Emanoel Júnior', 'Emanoel Júnior', null, '004709M98', '1PNMJ53', 'MALE', '1998-03-14', 'Brazil', 'DF', 27),
  ('001293M03', 'wiliete', 'DANIEL ARTUR KAKA', 'DANIEL ARTUR KAKA', null, '001293M03', '1L05V38', 'MALE', '2003-09-11', 'Angola', 'MF', 19),
  ('006986M07', 'wiliete', 'António Manuel Victorino Kulica', 'António Manuel Victorino Kulica', null, '006986M07', '1SCQY89', 'MALE', '2007-05-21', 'Angola', 'MF', 20),
  ('000461M93', 'wiliete', 'ARÃO MANUEL LOLOGI', 'ARÃO MANUEL LOLOGI', null, '000461M93', '1JSRPL0', 'MALE', '1993-09-06', 'Angola', 'DF', 5),
  ('001233M99', 'wiliete', 'ZEFERINO VENANCIO LUSSATI', 'ZEFERINO VENANCIO LUSSATI', null, '001233M99', '1KZR1V5', 'MALE', '1999-06-26', 'Angola', 'FWD', 33),
  ('000412M05', 'wiliete', 'VALTER MANUEL MONTEIRO', 'VALTER MANUEL MONTEIRO', null, '000412M05', '1JRV1H9', 'MALE', '2005-12-31', 'Angola', 'MF', 35),
  ('005349M93', 'wiliete', 'Guilherme Neto', 'Guilherme Neto', null, '005349M93', '1PU18X2', 'MALE', '1993-10-09', 'Brazil', 'DF', 4),
  ('000417M01', 'wiliete', 'Camilo Mbule Ngongue', 'Camilo Mbule Ngongue', null, '000417M01', '1JRXS05', 'MALE', '2001-12-07', 'Angola', 'MF', 28),
  ('008897M92', 'wiliete', 'Cristovão Paciência', 'Cristovão Paciência', null, '008897M92', '1UXFL56', 'MALE', '1992-06-01', 'Angola', 'FWD', 9),
  ('000448M92', 'wiliete', 'JORGE MENDES CORTE REAL CARNEIRO', 'JORGE MENDES CORTE REAL CARNEIRO', null, '000448M92', '1JSJBH0', 'MALE', '1992-02-19', 'Angola', 'MF', 7),
  ('000391M00', 'wiliete', 'TEODORO EDVALDO RITA TCHISSINGUI', 'TEODORO EDVALDO RITA TCHISSINGUI', null, '000391M00', '1JRTUE9', 'MALE', '2000-02-20', 'Angola', 'GK', 12),
  ('006176M04', 'wiliete', 'Bocar Sidibé', 'Bocar Sidibé', null, '006176M04', '1QVFJM7', 'MALE', '2004-01-26', 'Mali', 'MF', 30),
  ('008139M08', 'wiliete', 'Adenilson Paulo Tchingando', 'Adenilson Paulo Tchingando', null, '008139M08', '1UQNTJ4', 'MALE', '2008-02-05', 'Angola', 'DF', 36),
  ('005385M06', 'wiliete', 'Adriano Watchilala Tchombe', 'Adriano Watchilala Tchombe', null, '005385M06', '1PVXHT8', 'MALE', '2006-03-22', 'Angola', 'DF', 13),
  ('000445M01', 'wiliete', 'Gibele', 'DEIVI MIGUEL VIEIRA', 'Gibele', '000445M01', '1JSJ8T3', 'MALE', '2001-03-10', 'Angola', 'FWD', 11),
  ('002755M03', 'wiliete', 'CELIO ALBERTO JUNQUEIRA ZUA', 'CELIO ALBERTO JUNQUEIRA ZUA', null, '002755M03', '1M95S64', 'MALE', '2003-07-15', 'Angola', 'MF', 32),
  ('008136M07', 'wiliete', 'Abel Samandi Mbambi', 'Abel Samandi Mbambi', null, '008136M07', '1UQNSL6', 'MALE', '2007-07-26', 'Angola', 'GK', 40),
  ('003548M98', 'wiliete', 'Eduardo António Henrique capingana', 'Eduardo António Henrique capingana', null, '003548M98', '1NDEMR2', 'MALE', '1998-07-15', 'Angola', 'MF', 2)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Desportivo da Huíla — 28 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000960M96', 'desphuila', 'Cristóvão Simão', 'Cristóvão Simão', null, '000960M96', '1K1TTD1', 'MALE', '1996-06-01', 'Angola', 'GK', 1),
  ('000765M89', 'desphuila', 'Adilson Manuel', 'Adilson Manuel', null, '000765M89', '1K0RBE1', 'MALE', '1989-03-10', 'Angola', 'DF', 3),
  ('003460M04', 'desphuila', 'Dos Santos', 'ANTONIO DOS SANTOS FUTILA KINANGA', 'Dos Santos', '003460M04', '1NAKGC8', 'MALE', '2004-03-09', 'Angola', 'DF', 4),
  ('001232M98', 'desphuila', 'Jo', 'JOÃO MILAGRE CHIVA SIMÕES', 'Jo', '001232M98', '1KZR148', 'MALE', '1998-03-23', 'Angola', 'DF', 6),
  ('000447M92', 'desphuila', 'Cabibi', 'LEONARDO MANUEL ISOLA RAMOS', 'Cabibi', '000447M92', '1JSJ9J7', 'MALE', '1992-12-23', 'Angola', 'FWD', 7),
  ('000822M02', 'desphuila', 'Mauricio Pedro', 'Mauricio Pedro', null, '000822M02', '1K15AH5', 'MALE', '2002-03-20', 'Angola', 'MF', 8),
  ('000846M96', 'desphuila', 'José Mendes', 'José Mendes', null, '000846M96', '1K175G9', 'MALE', '1996-10-12', 'Angola', 'FWD', 10),
  ('000817M01', 'desphuila', 'Emanuel Laurindo', 'Emanuel Laurindo', null, '000817M01', '1K13ZM9', 'MALE', '2001-01-08', 'Angola', 'GK', 12),
  ('001158M05', 'desphuila', 'Ludy', 'LUCAS ELIAS ANTONIO PAULO', 'Ludy', '001158M05', '1K5T6S7', 'MALE', '2005-06-15', 'Angola', 'DF', 13),
  ('000844M92', 'desphuila', 'Elias Daniel', 'Elias Daniel', null, '000844M92', '1K173B5', 'MALE', '1992-07-11', 'Angola', 'MF', 15),
  ('000458M96', 'desphuila', 'Milton', 'MILTON ALBERTO DE OLIVEIRA SUCA', 'Milton', '000458M96', '1JSRFA8', 'MALE', '1996-03-23', 'Angola', 'FWD', 18),
  ('002101M03', 'desphuila', 'Alegria Feliciano Safewange', 'Alegria Feliciano Safewange', null, '002101M03', '1LIYL15', 'MALE', '2003-01-09', 'Angola', 'MF', 19),
  ('000819M00', 'desphuila', 'Duarte Kapoela', 'Duarte Kapoela', null, '000819M00', '1K141M2', 'MALE', '2000-11-25', 'Angola', 'MF', 20),
  ('002620M06', 'desphuila', 'Jenivaldo Afonso', 'Jenivaldo Afonso', null, '002620M06', '1M7IBH3', 'MALE', '2006-12-26', 'Angola', 'GK', 22),
  ('000849M90', 'desphuila', 'Florentino António', 'Florentino António', null, '000849M90', '1K176V9', 'MALE', '1990-10-16', 'Angola', 'DF', 23),
  ('000818M00', 'desphuila', 'Isidro Chingango', 'Isidro Chingango', null, '000818M00', '1K140K2', 'MALE', '2000-03-08', 'Angola', 'DF', 24),
  ('006020M95', 'desphuila', 'Milagre Carlos Simba', 'Milagre Carlos Simba', null, '006020M95', '1QSTPV6', 'MALE', '1995-07-29', 'Angola', 'FWD', 25),
  ('000823M02', 'desphuila', 'Jeremias Pedro', 'Jeremias Pedro', null, '000823M02', '1K15G24', 'MALE', '2002-06-07', 'Angola', 'DF', 26),
  ('005313M02', 'desphuila', 'Jose Augusto Camati', 'Jose Augusto Camati', null, '005313M02', '1PQ2JF4', 'MALE', '2002-11-02', 'Angola', 'FWD', 28),
  ('000845M93', 'desphuila', 'Pequenino Castro', 'Pequenino Castro', null, '000845M93', '1K174G0', 'MALE', '1993-09-24', 'Angola', 'MF', 29),
  ('002964M02', 'desphuila', 'Diloy Cleberson Bernardo Valerio', 'Diloy Cleberson Bernardo Valerio', null, '002964M02', '1MDNGV9', 'MALE', '2002-05-21', 'Angola', 'FWD', 31),
  ('002350M04', 'desphuila', 'Jorge Ismael Jose Jose', 'Jorge Ismael Jose Jose', null, '002350M04', '1LNIYJ8', 'MALE', '2004-09-24', 'Angola', 'FWD', 33),
  ('006317M06', 'desphuila', 'João Baptista Ferraz Samazanga Juny', 'João Baptista Ferraz Samazanga Juny', null, '006317M06', '1R3L049', 'MALE', '2006-01-31', 'Angola', 'FWD', 34),
  ('008904M03', 'desphuila', 'Mirovaldo da Silva vandunem', 'Mirovaldo da Silva vandunem', null, '008904M03', '1UXRG98', 'MALE', '2003-08-16', 'Angola', 'MF', 35),
  ('001412M02', 'desphuila', 'Constantino Tchicundico Cassoma Tchitunda', 'Constantino Tchicundico Cassoma Tchitunda', null, '001412M02', '1L3KX90', 'MALE', '2002-03-12', 'Angola', 'MF', 32),
  ('000959M96', 'desphuila', 'António Pena', 'António Pena', null, '000959M96', '1K1TSN8', 'MALE', '1996-01-14', 'Angola', 'MF', 27),
  ('000853M98', 'desphuila', 'Angelo Cangu', 'Angelo Cangu', null, '000853M98', '1K17IS6', 'MALE', '1998-12-07', 'Angola', 'MF', 21),
  ('000940M04', 'desphuila', 'NSAMBO KATENDI', 'NSAMBO KATENDI', null, '000940M04', '1K1SFM9', 'MALE', '2004-02-18', 'Angola', 'DF', 2)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- CD 1.º de Agosto — 26 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('002187M03', 'dago', 'Axel Gaudêncio Mabaqui de Sousa Axel', 'Axel Gaudêncio Mabaqui de Sousa Axel', null, '002187M03', '1LJU8Q3', 'MALE', '2003-05-05', 'Angola', null, 8),
  ('000423M93', 'dago', 'Bonifacio Francisco Caetano', 'Bonifacio Francisco Caetano', null, '000423M93', '1JRYBB6', 'MALE', '1993-06-09', 'Angola', null, 5),
  ('005431M03', 'dago', 'MILTON ANTONIO CANDIDO', 'MILTON ANTONIO CANDIDO', null, '005431M03', '1PXU6F2', 'MALE', '2003-01-05', 'Angola', null, 2),
  ('004958M08', 'dago', 'Felisberto Kanjeque Lourenço Carvalho', 'Felisberto Kanjeque Lourenço Carvalho', null, '004958M08', '1PNY6E7', 'MALE', '2008-10-30', 'Angola', null, null),
  ('001234M00', 'dago', 'Francisco Carlos Chilumbo', 'Francisco Carlos Chilumbo', null, '001234M00', '1KZR6C1', 'MALE', '2000-12-25', 'Angola', null, 20),
  ('000441M97', 'dago', 'Samu Tshibamba Dago', 'Samu Tshibamba Dago', null, '000441M97', '1JSJ4J2', 'MALE', '1997-09-03', 'Republic of the Congo', null, 17),
  ('000634M01', 'dago', 'FERNANDO LOPES DE ALMEIDA', 'FERNANDO LOPES DE ALMEIDA', null, '000634M01', '1JZ3MQ2', 'MALE', '2001-01-09', 'Angola', null, 1),
  ('005437M98', 'dago', 'ERIQUE JOAQUIM MANUEL DE JESUS', 'ERIQUE JOAQUIM MANUEL DE JESUS', null, '005437M98', '1PXWMN6', 'MALE', '1998-02-18', 'Angola', null, 24),
  ('000451M99', 'dago', 'Simao Dianzenza', 'Simao Dianzenza', null, '000451M99', '1JSKTW9', 'MALE', '1999-12-30', 'Angola', null, 3),
  ('005428M02', 'dago', 'ANTONIO FRANCISCO DOMINGOS', 'ANTONIO FRANCISCO DOMINGOS', null, '005428M02', '1PXS6R1', 'MALE', '2002-12-07', 'Angola', null, 7),
  ('004967M09', 'dago', 'Eliseu Sebastião Francisco ESCALÃO DE FORMAÇÃO', 'Eliseu Sebastião Francisco ESCALÃO DE FORMAÇÃO', null, '004967M09', '1PNY6S0', 'MALE', '2009-02-07', 'Angola', null, null),
  ('001997M94', 'dago', 'Jose Macaia ganga', 'Jose Macaia ganga', null, '001997M94', '1JP2N29', 'MALE', '1994-03-24', 'Angola', null, 16),
  ('005394M01', 'dago', 'Enoque José Kabesa', 'Enoque José Kabesa', null, '005394M01', '1PWAAY2', 'MALE', '2001-05-26', 'Angola', null, 23),
  ('000436M95', 'dago', 'Venancio Landu kukula', 'Venancio Landu kukula', null, '000436M95', '1JSF794', 'MALE', '1995-06-11', 'Angola', null, 15),
  ('000843M94', 'dago', 'Florindo Machado', 'Florindo Machado', null, '000843M94', '1K16NJ0', 'MALE', '1994-08-04', 'Angola', null, 9),
  ('000437M95', 'dago', 'Bruno de Jesus Manuel', 'Bruno de Jesus Manuel', null, '000437M95', '1JSF904', 'MALE', '1995-09-25', 'Angola', null, 6),
  ('001210M98', 'dago', 'ANSELMO MWENI', 'ANSELMO MWENI', null, '001210M98', '1KYQMU3', 'MALE', '1998-01-05', 'Angola', null, 22),
  ('005429M03', 'dago', 'BENÇÃO NBONGO EVARISTO NZINGA', 'BENÇÃO NBONGO EVARISTO NZINGA', null, '005429M03', '1PXS7W4', 'MALE', '2003-12-05', 'Angola', null, 36),
  ('003026M94', 'dago', 'Obed Mayamb Mukokiani Obed', 'Obed Mayamb Mukokiani Obed', null, '003026M94', '1ML75M8', 'MALE', '1994-09-24', 'Democratic Republic of the Congo', null, 14),
  ('005430M03', 'dago', 'AFONSO DOS SANTOS PAXE', 'AFONSO DOS SANTOS PAXE', null, '005430M03', '1PXU511', 'MALE', '2003-04-24', 'Angola', null, 19),
  ('000978M01', 'dago', 'Carvalho dos Santos', 'Carvalho dos Santos', null, '000978M01', '1K26F45', 'MALE', '2001-08-09', 'Angola', null, 27),
  ('000327M99', 'dago', 'CALEBI YANDA', 'CALEBI YANDA', null, '000327M99', '1JM8058', 'MALE', '1999-04-20', 'Angola', null, 10),
  ('004963M05', 'dago', 'Fernando Inácio Costa', 'Fernando Inácio Costa', null, '004963M05', '1PNY6K8', 'MALE', '2005-07-07', 'Angola', null, 11),
  ('002767M04', 'dago', 'Cliver Camango Andre', 'Cliver Camango Andre', null, '002767M04', '1M9F1P0', 'MALE', '2004-07-02', 'Angola', null, 18),
  ('007639M96', 'dago', 'Felix Bulaya', 'Felix Bulaya', null, '007639M96', '1TDC7R7', 'MALE', '1996-12-18', 'Zambia', null, 28),
  ('008964M02', 'dago', 'Luciano Manuel dos Santos', 'Luciano Manuel dos Santos', null, '008964M02', '1V12EK6', 'MALE', '2002-08-08', 'Angola', null, 25)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Kabuscorp SC — 25 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000371M01', 'kabuscorp', 'Mankoka Hegene Afonso', 'Mankoka Hegene Afonso', null, '000371M01', '1JRKU39', 'MALE', '2001-01-25', 'Angola', 'FWD', 18),
  ('007238M00', 'kabuscorp', 'Saombe Sukuakueche Ángelo Jorge', 'Saombe Sukuakueche Ángelo Jorge', null, '007238M00', '1SNB179', 'MALE', '2000-06-14', 'Angola', 'DF', 5),
  ('000631M97', 'kabuscorp', 'Eliseu', 'ELISEU CABANGA', 'Eliseu', '000631M97', '1JYP8V8', 'MALE', '1997-02-13', 'Angola', 'DF', 3),
  ('004835M05', 'kabuscorp', 'Aluízio Joel André Cacharamba', 'Aluízio Joel André Cacharamba', null, '004835M05', '1PNR1R0', 'MALE', '2005-11-16', 'Angola', 'MF', 27),
  ('001831M02', 'kabuscorp', 'TEODORO FERNANDES CORREIA', 'TEODORO FERNANDES CORREIA', null, '001831M02', '1LGPB81', 'MALE', '2002-09-17', 'Angola', 'DF', 11),
  ('000355M98', 'kabuscorp', 'JOÃO BAPTISTA MISSENGA DE NASCIMENTO', 'JOÃO BAPTISTA MISSENGA DE NASCIMENTO', null, '000355M98', '1JRIUE5', 'MALE', '1998-10-07', 'Angola', 'GK', 12),
  ('001833M03', 'kabuscorp', 'ADAIR GARCIA DOMINGOS', 'ADAIR GARCIA DOMINGOS', null, '001833M03', '1LGPGY7', 'MALE', '2003-11-12', 'Angola', 'DF', 4),
  ('000395M97', 'kabuscorp', 'DIÓGENES CAPEMBA JOÃO', 'DIÓGENES CAPEMBA JOÃO', null, '000395M97', '1JRTXH4', 'MALE', '1997-01-01', 'Angola', 'MF', 32),
  ('000326M99', 'kabuscorp', 'DANIEL KILOLA', 'DANIEL KILOLA', null, '000326M99', '1JM7ZR2', 'MALE', '1999-07-06', 'Angola', 'MF', 15),
  ('001136M01', 'kabuscorp', 'Zamorano Lopes', 'Zamorano Lopes', null, '001136M01', '1K4A836', 'MALE', '2001-08-18', 'Angola', 'DF', 2),
  ('000576M03', 'kabuscorp', 'MONA MALECO', 'CELESTINO LUIS MALECO', 'MONA MALECO', '000576M03', '1JXICB5', 'MALE', '2003-11-04', 'Angola', 'FWD', 17),
  ('000936M98', 'kabuscorp', 'ARTUR MALUNGO', 'ARTUR MALUNGO', null, '000936M98', '1K1SEN7', 'MALE', '1998-01-08', 'Angola', 'DF', 14),
  ('003056M99', 'kabuscorp', 'Henock Mangindula', 'Henock Mangindula', null, '003056M99', '1MPPSB5', 'MALE', '1999-11-20', 'Democratic Republic of the Congo', 'DF', 16),
  ('007766M08', 'kabuscorp', 'JORGE MANUEL PINTO', 'JORGE MANUEL PINTO', null, '007766M08', '1TGWGG5', 'MALE', '2008-12-26', 'Angola', 'MF', 35),
  ('006297M99', 'kabuscorp', 'MVEMBA MATONDO KUANZAMBI', 'MVEMBA MATONDO KUANZAMBI', null, '006297M99', '1QXNL72', 'MALE', '1999-03-03', 'Angola', 'DF', 28),
  ('000392M98', 'kabuscorp', 'AUGUSTO MONTEIRO MUALUCANO', 'AUGUSTO MONTEIRO MUALUCANO', null, '000392M98', '1JRTVA7', 'MALE', '1998-01-01', 'Angola', 'GK', 22),
  ('003262M05', 'kabuscorp', 'BAYALA NSIMBA', 'BAYALA NSIMBA', null, '003262M05', '1N3UHM6', 'MALE', '2005-07-07', 'Angola', 'FWD', 7),
  ('000331M96', 'kabuscorp', 'JOAQUIM PACIENCIA', 'JOAQUIM PACIENCIA', null, '000331M96', '1JM8HD7', 'MALE', '1996-07-07', 'Angola', 'FWD', 19),
  ('000536M02', 'kabuscorp', 'ENOQUE BENJAMIM TULA', 'ENOQUE BENJAMIM TULA', null, '000536M02', '1JWTS88', 'MALE', '2002-07-01', 'Angola', 'MF', 20),
  ('001072M96', 'kabuscorp', 'José Semedo Vunge', 'José Semedo Vunge', null, '001072M96', '1K2PK58', 'MALE', '1996-08-23', 'Angola', 'MF', 10),
  ('000425M99', 'kabuscorp', 'Alberto Elizeu Xavier', 'Alberto Elizeu Xavier', null, '000425M99', '1JS6M05', 'MALE', '1999-08-29', 'Angola', 'FWD', 29),
  ('002869M04', 'kabuscorp', 'MAZEBO MAVAMBO JOÃO', 'MAZEBO MAVAMBO JOÃO', null, '002869M04', '1MA68G7', 'MALE', '2006-06-08', 'Angola', 'GK', 21),
  ('009045M02', 'kabuscorp', 'LIWANDA JOSLIN NDONGALA', 'LIWANDA JOSLIN NDONGALA', null, '009045M02', '1V363C3', 'MALE', '2002-10-28', 'Democratic Republic of the Congo', 'DF', 13),
  ('007240M01', 'kabuscorp', 'Tresor Kuyu Nona', 'Tresor Kuyu Nona', null, '007240M01', '1SNEZ57', 'MALE', '2001-08-29', 'Democratic Republic of the Congo', 'FWD', 25),
  ('009044M03', 'kabuscorp', 'MBALI MONGBONGO SEM', 'MBALI MONGBONGO SEM', null, '009044M03', '1V363A9', 'MALE', '2003-08-04', 'Democratic Republic of the Congo', 'MF', 8)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Académica do Lobito — 28 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000542M92', 'lobito', 'LOURENÇO CAMBIOMBO SAPALO ADRIANO', 'LOURENÇO CAMBIOMBO SAPALO ADRIANO', null, '000542M92', '1JWU4V8', 'MALE', '1992-02-27', 'Angola', 'MF', 5),
  ('008954M04', 'lobito', 'JORGE UMBA BAIÃO', 'JORGE UMBA BAIÃO', null, '008954M04', '1V0Q4P5', 'MALE', '2004-07-14', 'Angola', 'DF', 28),
  ('000358M94', 'lobito', 'GERVÁSIO DOMINGOS CALELA', 'GERVÁSIO DOMINGOS CALELA', null, '000358M94', '1JRJ1L5', 'MALE', '1994-05-16', 'Angola', 'DF', 13),
  ('001187M03', 'lobito', 'CHICO PAPEL', 'Joaquim Francisco Cambanda', 'CHICO PAPEL', '001187M03', '1KF4IS2', 'MALE', '2003-01-16', 'Angola', 'MF', 16),
  ('000723M00', 'lobito', 'Rósario Adao Da Costa Cavanda', 'Rósario Adao Da Costa Cavanda', null, '000723M00', '1K00768', 'MALE', '2000-01-18', 'Angola', 'DF', 4),
  ('005406M06', 'lobito', 'PANZO', 'Miguel Dos Santos', 'PANZO', '005406M06', '1PWCQF0', 'MALE', '2006-12-23', 'Angola', 'MF', 24),
  ('002001M05', 'lobito', 'FERNANDO ELIAS KACHIKAPA', 'FERNANDO ELIAS KACHIKAPA', null, '002001M05', '1NYJXJ8', 'MALE', '2005-03-25', 'Angola', 'DF', 36),
  ('001009M95', 'lobito', 'GERALDO NDJELA', 'Geraraldo Perdo Feliciano', 'GERALDO NDJELA', '001009M95', '1K29176', 'MALE', '1995-02-24', 'Angola', 'MF', 21),
  ('003145M06', 'lobito', 'FLORENTINO VASCO GOMES MATEMBA', 'FLORENTINO VASCO GOMES MATEMBA', null, '003145M06', '1MU1RP4', 'MALE', '2006-08-21', 'Angola', 'FWD', 11),
  ('005404M04', 'lobito', 'JOSÉ KETA GONGA', 'JOSÉ KETA GONGA', null, '005404M04', '1PWB407', 'MALE', '2004-04-09', 'Angola', 'DF', 22),
  ('000585M05', 'lobito', 'MARCOS YANIKI CANDUCO HOLIVIO', 'MARCOS YANIKI CANDUCO HOLIVIO', null, '000585M05', '1JXIDN6', 'MALE', '2005-06-06', 'Angola', 'GK', 40),
  ('008955M05', 'lobito', 'JOEL MANZAMBI KIBANGO JORGE', 'JOEL MANZAMBI KIBANGO JORGE', null, '008955M05', '1V0Q4R8', 'MALE', '2005-06-26', 'Angola', 'DF', 2),
  ('005408M94', 'lobito', 'Ezequiel Paulo Julião', 'Ezequiel Paulo Julião', null, '005408M94', '1PWDZW1', 'MALE', '1994-06-03', 'Angola', 'MF', 10),
  ('002807M05', 'lobito', 'AURÉLIO NIVETE LOPAI KAPUCA ( HELI)', 'AURÉLIO NIVETE LOPAI KAPUCA ( HELI)', null, '002807M05', '1M9SUA5', 'MALE', '2005-04-13', 'Angola', 'FWD', 33),
  ('002563M07', 'lobito', 'LEONEL AUGUSTO MATEUS LEMOS', 'LEONEL AUGUSTO MATEUS LEMOS', null, '002563M07', '1M79NL1', 'MALE', '2007-04-03', 'Angola', 'DF', 38),
  ('000422M02', 'lobito', 'Manuel Pereira Londaka', 'Manuel Pereira Londaka', null, '000422M02', '1JRYAL7', 'MALE', '2002-03-20', 'Angola', 'MF', 6),
  ('003527M03', 'lobito', 'FARRADA', 'Maurício Mwatenda Lucas (Farrada)', 'FARRADA', '003527M03', '1NC8YH3', 'MALE', '2003-05-11', 'Angola', 'DF', 26),
  ('001057M97', 'lobito', 'NANGA JOÃO MANUEL', 'NANGA JOÃO MANUEL', null, '001057M97', '1K2M005', 'MALE', '1997-12-10', 'Angola', 'DF', 3),
  ('001383M96', 'lobito', 'JOJO', 'Serafim Paulina Mapussa', 'JOJO', '001383M96', '1L13Q80', 'MALE', '1996-06-06', 'Angola', 'MF', 15),
  ('001495M05', 'lobito', 'LUÍS NFUMAIASOKA MIGUEL PANDA', 'LUÍS NFUMAIASOKA MIGUEL PANDA', null, '001495M05', '1L60XH8', 'MALE', '2005-09-05', 'Angola', 'MF', 31),
  ('000530M00', 'lobito', 'CAVALO', 'ANTONIO SILVIO MORAIS', 'CAVALO', '000530M00', '1JWT9F1', 'MALE', '2000-05-02', 'Angola', 'FWD', 19),
  ('000543M98', 'lobito', 'GUILHERME ALBERTO MUHANGO', 'GUILHERME ALBERTO MUHANGO', null, '000543M98', '1JWU6G0', 'MALE', '1998-06-22', 'Angola', 'DF', 12),
  ('008669M10', 'lobito', 'ANDRÉ ALFREDO JOÃO PANDA', 'ANDRÉ ALFREDO JOÃO PANDA', null, '008669M10', '1UVIZ40', 'MALE', '2010-08-09', 'Angola', null, null),
  ('000356M91', 'lobito', 'JANUÁRIO DA CRUZ SESA', 'JANUÁRIO DA CRUZ SESA', null, '000356M91', '1JRIVB7', 'MALE', '1991-02-21', 'Angola', 'MF', 7),
  ('000583M05', 'lobito', 'VALÉRIO MAGRINHO TROCO ZAIRE', 'VALÉRIO MAGRINHO TROCO ZAIRE', null, '000583M05', '1JXIDJ3', 'MALE', '2005-12-28', 'Angola', 'MF', 29),
  ('005187M07', 'lobito', 'CARLOS ANTÓNIO CORREIA', 'CARLOS ANTÓNIO CORREIA', null, '005187M07', '1PPGLQ5', 'MALE', '2007-04-04', 'Angola', 'DF', 35),
  ('005764M01', 'lobito', 'JORGE ENIO ANTONIO DA COSTA', 'JORGE ENIO ANTONIO DA COSTA', null, '005764M01', '1QHQT19', 'MALE', '2001-08-26', 'Angola', 'DF', 27),
  ('002021M01', 'lobito', 'WILSON DAVID', 'WILSON DAVID', null, '002021M01', '1LIWQN1', 'MALE', '2001-08-06', 'Angola', 'DF', 25)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- FC Luanda — 23 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('007427M02', 'fcluanda', 'JOAO MADUVO CAPITA CAFULA', 'JOAO MADUVO CAPITA CAFULA', null, '007427M02', '1T6AZN3', 'MALE', '2002-03-01', 'Angola', 'GK', 1),
  ('001538M06', 'fcluanda', 'DENILSON', 'DENILSON', null, '001538M06', '1L7LPH0', 'MALE', '2006-04-19', 'Angola', 'FWD', 10),
  ('001566M05', 'fcluanda', 'LUDIAKUENO', 'LUDIAKUENO', null, '001566M05', '1L7WK59', 'MALE', '2005-07-29', 'Angola', 'GK', 12),
  ('002901M07', 'fcluanda', 'DOMINGOS', 'DOMINGOS', null, '002901M07', '1MALL47', 'MALE', '2007-05-24', 'Angola', 'MF', 14),
  ('001336M04', 'fcluanda', 'DOMINGOS', 'DOMINGOS', null, '001336M04', '1L08HY2', 'MALE', '2004-12-03', 'Angola', 'MF', 25),
  ('000770M91', 'fcluanda', 'Estevao Cahoko', 'Estevao Cahoko', null, '000770M91', '1K0RP19', 'MALE', '1991-02-22', 'Angola', 'MF', 24),
  ('001357M05', 'fcluanda', 'FRANCISCO', 'FRANCISCO', null, '001357M05', '1L11132', 'MALE', '2005-05-07', 'Angola', 'FWD', 9),
  ('005756M94', 'fcluanda', 'Joel Diaku', 'Joel Diaku', null, '005756M94', '1QHQN96', 'MALE', '1994-02-18', 'Angola', 'DF', 4),
  ('002707M03', 'fcluanda', 'Arnaldo Dielo', 'Arnaldo Dielo', null, '002707M03', '1M8XDU3', 'MALE', '2006-05-09', 'Angola', 'MF', 16),
  ('008947M05', 'fcluanda', 'BATISTA JÁO KACHAMA KACHAMA', 'BATISTA JÁO KACHAMA KACHAMA', null, '008947M05', '1V0CA42', 'MALE', '2005-09-06', 'Angola', 'MF', 27),
  ('007431M06', 'fcluanda', 'RUBEN CRISTIANO MBALA LUWAWA', 'RUBEN CRISTIANO MBALA LUWAWA', null, '007431M06', '1T6B2Z2', 'MALE', '2006-10-27', 'Angola', 'MF', 15),
  ('001100M93', 'fcluanda', 'Filipe Malanda', 'Filipe Malanda', null, '001100M93', '1K2WTH5', 'MALE', '1993-05-10', 'Angola', 'DF', 17),
  ('002208M01', 'fcluanda', 'Jonilson José Manuel Manuel', 'Jonilson José Manuel Manuel', null, '002208M01', '1LJVMR0', 'MALE', '2001-03-12', 'Angola', 'DF', 6),
  ('006197M05', 'fcluanda', 'Celio Nimi', 'Celio Nimi', null, '006197M05', '1QW3Z14', 'MALE', '2005-06-24', 'Angola', 'MF', 26),
  ('002899M05', 'fcluanda', 'KANO', 'KANO', null, '002899M05', '1MALHF8', 'MALE', '2005-01-12', 'Angola', 'FWD', 31),
  ('002014M04', 'fcluanda', 'PEDRO', 'PEDRO', null, '002014M04', '1LIWNQ8', 'MALE', '2004-04-10', 'Angola', 'MF', 7),
  ('006241M07', 'fcluanda', 'JAIME', 'JAIME', null, '006241M07', '1QW9VB1', 'MALE', '2007-09-09', 'Angola', 'MF', 30),
  ('002190M99', 'fcluanda', 'Gelson Dos Santos André Gelson', 'Gelson Dos Santos André Gelson', null, '002190M99', '1LJUDK2', 'MALE', '1999-05-01', 'Angola', 'MF', 8),
  ('001326M06', 'fcluanda', 'MIGUEL NZAU MANUEL MATOS', 'MIGUEL NZAU MANUEL MATOS', null, '001326M06', '1L064E1', 'MALE', '2006-09-11', 'Angola', 'MF', 23),
  ('001560M03', 'fcluanda', 'DEO', 'DEO', null, '001560M03', '1L7W9K9', 'MALE', '2003-01-01', 'Angola', 'GK', 22),
  ('002894M04', 'fcluanda', 'PEDRO', 'PEDRO', null, '002894M04', '1MALDR2', 'MALE', '2004-02-14', 'Angola', 'DF', 28),
  ('003140M00', 'fcluanda', 'Euclides Dos Santos', 'Euclides Dos Santos', null, '003140M00', '1MTNDT1', 'MALE', '2000-01-18', 'Angola', 'MF', 5),
  ('002896M04', 'fcluanda', 'HAMILTON', 'HAMILTON', null, '002896M04', '1MALDZ0', 'MALE', '2004-05-02', 'Angola', 'MF', 2)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Recreativo do Libolo — 23 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('001106M01', 'libolo', 'Andre', 'Andre', null, '001106M01', '1K2X4C2', 'MALE', '2001-03-27', 'Angola', null, 10),
  ('001041M96', 'libolo', 'ADELINO WIMA CALUNHI ANTONIO', 'ADELINO WIMA CALUNHI ANTONIO', null, '001041M96', '1K2IVX4', 'MALE', '1996-10-13', 'Angola', null, 5),
  ('003627M98', 'libolo', 'Zidan Bernardo António Francisco', 'Zidan Bernardo António Francisco', null, '003627M98', '1NGGGT5', 'MALE', '1998-08-21', 'Angola', null, 22),
  ('007243M00', 'libolo', 'JOSÉ', 'JOSÉ', null, '007243M00', '1SPT0X9', 'MALE', '2000-01-26', 'Angola', null, 19),
  ('003692M98', 'libolo', 'MARCOS', 'MARCOS', null, '003692M98', '1NVR114', 'MALE', '1998-06-12', 'Angola', null, 3),
  ('000432M98', 'libolo', 'Zinadine Zidane Moises Catraio', 'Zinadine Zidane Moises Catraio', null, '000432M98', '1JSF5M3', 'MALE', '1998-05-17', 'Angola', null, 24),
  ('005432M98', 'libolo', 'CARDOSO ERNESTO VIEIRA CHICAIANGO', 'CARDOSO ERNESTO VIEIRA CHICAIANGO', null, '005432M98', '1PXU6W1', 'MALE', '1998-10-28', 'Angola', null, 2),
  ('003307M00', 'libolo', 'Edmilson Joao Francisco Cuxixima', 'Edmilson Joao Francisco Cuxixima', null, '003307M00', '1N6N208', 'MALE', '2000-02-11', 'Angola', null, 27),
  ('000884M00', 'libolo', 'GERSON FRANCISCO CHIMBELE DA COSTA', 'GERSON FRANCISCO CHIMBELE DA COSTA', null, '000884M00', '1K1IAB9', 'MALE', '2000-03-09', 'Angola', null, 6),
  ('000730M92', 'libolo', 'Manuel Jacinto Domingos', 'Manuel Jacinto Domingos', null, '000730M92', '1K00SC7', 'MALE', '1992-06-14', 'Angola', null, 28),
  ('001918M02', 'libolo', 'Bernardo Lomanda kamutcha Gunda', 'Bernardo Lomanda kamutcha Gunda', null, '001918M02', '1LIH843', 'MALE', '2000-11-12', 'Angola', 'GK', 12),
  ('005427M06', 'libolo', 'João Mário Justino Jamba', 'João Mário Justino Jamba', null, '005427M06', '1PXNCS9', 'MALE', '2006-04-15', 'Angola', 'GK', 20),
  ('001684M01', 'libolo', 'Joel Kaluvala Alexandre Lucamba', 'Joel Kaluvala Alexandre Lucamba', null, '001684M01', '1LAEC84', 'MALE', '2001-06-06', 'Angola', null, 30),
  ('001797M95', 'libolo', 'ARISTOTES KINGUI MAKANI', 'ARISTOTES KINGUI MAKANI', null, '001797M95', '1LDHZJ2', 'MALE', '1995-04-24', 'Angola', null, 4),
  ('000979M01', 'libolo', 'Manuel Manjolo', 'Manuel Manjolo', null, '000979M01', '1K26H69', 'MALE', '2001-02-19', 'Angola', null, 14),
  ('008940M04', 'libolo', 'PEDRO AFONSO MASSAKI', 'PEDRO AFONSO MASSAKI', null, '008940M04', '1UZYXC4', 'MALE', '2004-02-16', 'Angola', null, 17),
  ('002078M07', 'libolo', 'JORGE', 'JORGE', null, '002078M07', '1LIY4I5', 'MALE', '2007-09-20', 'Angola', null, 15),
  ('002983M01', 'libolo', 'Salomão Mukanda', 'Salomão Mukanda', null, '002983M01', '1MJSXB9', 'MALE', '2001-06-27', 'Angola', null, 25),
  ('005434M00', 'libolo', 'Fernando José Paulino Lourenço', 'Fernando José Paulino Lourenço', null, '005434M00', '1PXU766', 'MALE', '2000-03-18', 'Angola', null, 16),
  ('007249M05', 'libolo', 'Vandelson Estevão Pedro João', 'Vandelson Estevão Pedro João', null, '007249M05', '1SPWXV4', 'MALE', '2005-06-14', 'Angola', null, 23),
  ('001094M91', 'libolo', 'Ilidio da Silva', 'Ilidio da Silva', null, '001094M91', '1K2WLB8', 'MALE', '1991-11-21', 'Angola', null, 8),
  ('005765M06', 'libolo', 'AMADO TIAGO MARQUES HAIDARA', 'AMADO TIAGO MARQUES HAIDARA', null, '005765M06', '1QHQTD1', 'MALE', '2006-09-22', 'Angola', null, 18),
  ('003083M05', 'libolo', 'DIOGO DA ROCHA QUIAMESSO', 'DIOGO DA ROCHA QUIAMESSO', null, '003083M05', '1MR7M11', 'MALE', '2005-05-24', 'Angola', null, 11)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- CR Caála — 26 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('008905M09', 'caala', 'TIAGO JAMBA ADELINO', 'TIAGO JAMBA ADELINO', null, '008905M09', '1UY6AR6', 'MALE', '2009-05-17', 'Angola', 'FWD', 33),
  ('000648M01', 'caala', 'BENVINDO MIGUEL ANDRÉ AFONSO', 'BENVINDO MIGUEL ANDRÉ AFONSO', null, '000648M01', '1JZ4PI8', 'MALE', '2001-10-10', 'Angola', 'MF', 04),
  ('001035M01', 'caala', 'FELIX CASSULE ANDRE', 'FELIX CASSULE ANDRE', null, '001035M01', '1K2IP48', 'MALE', '2001-11-03', 'Angola', 'DF', 26),
  ('001763M95', 'caala', 'Benedito Antunes', 'Benedito Antunes', null, '001763M95', '1LDA172', 'MALE', '1995-07-06', 'Angola', 'MF', 19),
  ('000673M97', 'caala', 'FRANCISCO', 'FRANCISCO', null, '000673M97', '1JZJ8Y2', 'MALE', '1997-10-07', 'Angola', 'DF', 16),
  ('000428M96', 'caala', 'Domingos Lourenço Cuxixima', 'Domingos Lourenço Cuxixima', null, '000428M96', '1JS6NR7', 'MALE', '1996-01-17', 'Angola', 'FWD', 07),
  ('000738M91', 'caala', 'JOSE AFONSO DOS SANTOS FERNANDO', 'JOSE AFONSO DOS SANTOS FERNANDO', null, '000738M91', '1K0AG17', 'MALE', '1991-04-30', 'Angola', 'GK', 30),
  ('003206M97', 'caala', 'Domingos Braga Laurindo Fernando', 'Domingos Braga Laurindo Fernando', null, '003206M97', '1MXAHV0', 'MALE', '1997-12-11', 'Angola', 'MF', 29),
  ('001215M00', 'caala', 'Osvaldo', 'Osvaldo', null, '001215M00', '1KZ4ES4', 'MALE', '2000-12-08', 'Angola', 'MF', 06),
  ('001694M05', 'caala', 'ALBANO KUPENALA', 'ALBANO KUPENALA', null, '001694M05', '1LB66S2', 'MALE', '2005-08-13', 'Angola', 'DF', 03),
  ('005264M04', 'caala', 'ESTEVÂO LUSSENDJE', 'ESTEVÂO LUSSENDJE', null, '005264M04', '1PPTR71', 'MALE', '2004-12-31', 'Angola', 'GK', 12),
  ('000656M76', 'caala', 'Gonçalves Zinho Manico', 'Gonçalves Zinho Manico', null, '000656M76', '1JZHZH1', 'MALE', '1996-02-11', 'Angola', 'DF', 21),
  ('000721M90', 'caala', 'Landu', 'Landu', null, '000721M90', '1K002P8', 'MALE', '1990-01-04', 'Angola', 'GK', 22),
  ('003157M01', 'caala', 'Manuel Zange Miguel', 'Manuel Zange Miguel', null, '003157M01', '1MUVV97', 'MALE', '2002-07-08', 'Angola', 'MF', 20),
  ('003665M07', 'caala', 'LOURENÇO ANTÓNIO PEREIRA', 'LOURENÇO ANTÓNIO PEREIRA', null, '003665M07', '1NJJKZ4', 'MALE', '2007-07-27', 'Angola', 'MF', 31),
  ('006363M99', 'caala', 'JOSÉ MANUEL RAUL', 'JOSÉ MANUEL RAUL', null, '006363M99', '1R8LP51', 'MALE', '1999-11-17', 'Angola', 'FWD', 27),
  ('007412M04', 'caala', 'valentim sacuvale', 'valentim sacuvale', null, '007412M04', '1T647T5', 'MALE', '2004-06-01', 'Angola', 'DF', 02),
  ('001086M96', 'caala', 'Timoteo Sambissa', 'Timoteo Sambissa', null, '001086M96', '1K2QWK8', 'MALE', '1996-01-11', 'Angola', 'FWD', 24),
  ('000763M97', 'caala', 'VALENTE', 'Hermenegildo Sandumbo', 'VALENTE', '000763M97', '1K0R4W6', 'MALE', '1997-04-15', 'Angola', 'FWD', 09),
  ('000603M93', 'caala', 'SEQUESSEQUE', 'ABEL SILAS SEQUESSEQUE', 'SEQUESSEQUE', '000603M93', '1JXIKQ1', 'MALE', '1993-06-04', 'Angola', 'DF', 25),
  ('000691M00', 'caala', 'LISNEU EMANUEL NETO SIMAO', 'LISNEU EMANUEL NETO SIMAO', null, '000691M00', '1JZKSC2', 'MALE', '2000-03-20', 'Angola', 'MF', 23),
  ('000768M94', 'caala', 'Claúdio Sozinho', 'Claúdio Sozinho', null, '000768M94', '1K0REM6', 'MALE', '1994-10-03', 'Angola', 'MF', 08),
  ('001592M05', 'caala', 'GABRIEL', 'GABRIEL', null, '001592M05', '1L96DJ1', 'MALE', '2005-05-13', 'Angola', 'FWD', 17),
  ('000462M95', 'caala', 'MARIANO DA COSTA VIDAL', 'MARIANO DA COSTA VIDAL', null, '000462M95', '1JSRQB0', 'MALE', '1995-02-20', 'Angola', 'DF', 15),
  ('000521M99', 'caala', 'ARILSON DE CEITA PEREIRA JORGE', 'ARILSON DE CEITA PEREIRA JORGE', null, '000521M99', '1JWGZB2', 'MALE', '1999-05-13', 'Angola', 'MF', 10),
  ('006171M05', 'caala', 'ERNESTO', 'ERNESTO', null, '006171M05', '1QVFE29', 'MALE', '2005-06-22', 'Angola', 'FWD', 34)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- GD Interclube — 27 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('003148M04', 'interclube', 'ANDERSON ARIEU CALENGUE AFONSO', 'ANDERSON ARIEU CALENGUE AFONSO', null, '003148M04', '1MUAZF5', 'MALE', '2004-04-04', 'Angola', 'MF', 17),
  ('000898M99', 'interclube', 'Osvaldo Augusto Francisco', 'Osvaldo Augusto Francisco', null, '000898M99', '1K1KET3', 'MALE', '1999-06-05', 'Angola', 'DF', 27),
  ('003648M03', 'interclube', 'Afonso Baptista', 'Afonso Baptista', null, '003648M03', '1NI2DP9', 'MALE', '2003-06-08', 'Angola', 'FWD', 36),
  ('007554M05', 'interclube', 'DOMINGOS MIGUEL BRAVO', 'DOMINGOS MIGUEL BRAVO', null, '007554M05', '1T9MIP7', 'MALE', '2005-12-25', 'Angola', 'DF', 26),
  ('000483M03', 'interclube', 'SALOMÃO', 'SALOMÃO', null, '000483M03', '1JTV4K9', 'MALE', '2003-03-19', 'Angola', 'DF', 5),
  ('000368M04', 'interclube', 'ALEXANDRE DOMINGOS NGUNZA CACULO', 'ALEXANDRE DOMINGOS NGUNZA CACULO', null, '000368M04', '1JRKQX3', 'MALE', '2004-02-14', 'Angola', 'MF', 37),
  ('004954M05', 'interclube', 'Lionel João Barão Cambuta', 'Lionel João Barão Cambuta', null, '004954M05', '1PNY691', 'MALE', '2005-04-14', 'Angola', 'DF', 2),
  ('008919M01', 'interclube', 'WALTER EMANUEL DE SÁ CARVALHO CARVALHO', 'WALTER EMANUEL DE SÁ CARVALHO CARVALHO', null, '008919M01', '1UZ41E0', 'MALE', '2001-07-26', 'Angola', 'FWD', 20),
  ('000526M97', 'interclube', 'PEDRO HONJO CHIMBIAMBINLU', 'PEDRO HONJO CHIMBIAMBINLU', null, '000526M97', '1JWSSZ2', 'MALE', '1997-06-12', 'Angola', 'FWD', 10),
  ('005393M06', 'interclube', 'OCTAVIO LEITE FERNANDES CRUZ', 'OCTAVIO LEITE FERNANDES CRUZ', null, '005393M06', '1PW03I4', 'MALE', '2006-09-12', 'Angola', 'MF', 21),
  ('002451M04', 'interclube', 'MOISÉS', 'MOISÉS', null, '002451M04', '1LZLZP0', 'MALE', '2004-06-30', 'Angola', 'DF', 28),
  ('000983M00', 'interclube', 'Pedro Ganga', 'Pedro Ganga', null, '000983M00', '1K26VW6', 'MALE', '2000-08-12', 'Angola', 'MF', 32),
  ('002748M06', 'interclube', 'PAULO', 'PAULO', null, '002748M06', '1M92D85', 'MALE', '2006-03-02', 'Angola', 'DF', 33),
  ('003217M03', 'interclube', 'FREDY DA GRAÇA SEBASTIÃO LOPES', 'FREDY DA GRAÇA SEBASTIÃO LOPES', null, '003217M03', '1MYP5Z8', 'MALE', '2003-03-20', 'Angola', 'DF', 39),
  ('003726M06', 'interclube', 'JONAS KAQUEIA LUCAS', 'JONAS KAQUEIA LUCAS', null, '003726M06', '1NW4P04', 'MALE', '2006-02-28', 'Angola', 'FWD', 35),
  ('000482M97', 'interclube', 'ALBERTO', 'ALBERTO', null, '000482M97', '1JTV3G3', 'MALE', '1997-12-06', 'Angola', 'MF', 6),
  ('000490M95', 'interclube', 'JORGE', 'JORGE', null, '000490M95', '1JTVF71', 'MALE', '1996-05-01', 'Angola', 'GK', 22),
  ('005667M05', 'interclube', 'PEDRO GABRIEL MALANDA MIGUEL', 'PEDRO GABRIEL MALANDA MIGUEL', null, '005667M05', '1QFXVU3', 'MALE', '2005-08-29', 'Angola', 'MF', 8),
  ('000699M04', 'interclube', 'SILVANO MONTEIRO', 'SILVANO MONTEIRO', null, '000699M04', '1JZYK44', 'MALE', '2004-10-07', 'Angola', 'FWD', 30),
  ('005617M07', 'interclube', 'ANALTINO JOSÉ FERNANDO MUALIFANGUE', 'ANALTINO JOSÉ FERNANDO MUALIFANGUE', null, '005617M07', '1QFF753', 'MALE', '2007-05-15', 'Angola', 'MF', 31),
  ('001214M04', 'interclube', 'Alcides Patrício', 'Alcides Patrício', null, '001214M04', '1KZ4CQ5', 'MALE', '2004-04-22', 'Angola', 'MF', 14),
  ('000649M01', 'interclube', 'GABRIEL SAMUEL PANZO', 'GABRIEL SAMUEL PANZO', null, '000649M01', '1JZ6PV1', 'MALE', '2001-10-13', 'Angola', 'GK', 12),
  ('002576M04', 'interclube', 'Pascoal Paulino', 'Pascoal Paulino', null, '002576M04', '1M7HYZ3', 'MALE', '2004-06-20', 'Angola', 'DF', 23),
  ('000481M99', 'interclube', 'EDIVALDO', 'EDIVALDO', null, '000481M99', '1JTUYS4', 'MALE', '1999-07-30', 'Angola', 'DF', 18),
  ('000463M98', 'interclube', 'FERNANDO JACINTO QUISSANGA', 'FERNANDO JACINTO QUISSANGA', null, '000463M98', '1JSRQX5', 'MALE', '1998-05-25', 'Angola', 'DF', 25),
  ('006738M08', 'interclube', 'Bartolomeu Taivando Anacleto Sachimala', 'Bartolomeu Taivando Anacleto Sachimala', null, '006738M08', '1SCCIV4', 'MALE', '2008-05-06', 'Angola', 'FWD', 38),
  ('000793M98', 'interclube', 'FELISBERTO', 'FELISBERTO', null, '000793M98', '1K0SA99', 'MALE', '1998-03-02', 'Angola', 'FWD', 29)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Bravos do Maquis — 26 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000424M02', 'bravos', 'Jeronimo Mendes Abrao', 'Jeronimo Mendes Abrao', null, '000424M02', '1JS6L23', 'MALE', '2002-01-09', 'Angola', null, 6),
  ('001731M01', 'bravos', 'Agnaldo', 'Agnaldo Emerson Catanga', 'Agnaldo', '001731M01', '1LD8AS7', 'MALE', '2001-08-20', 'Angola', null, 3),
  ('001145M97', 'bravos', 'OLIVEIRA ANTONIO', 'OLIVEIRA ANTONIO', null, '001145M97', '1K4MZ03', 'MALE', '1997-05-02', 'Angola', null, 27),
  ('000646M01', 'bravos', 'MANUEL POMBOLO ANTÓNIO', 'MANUEL POMBOLO ANTÓNIO', null, '000646M01', '1JZ4L62', 'MALE', '2001-09-15', 'Angola', null, 22),
  ('001251M04', 'bravos', 'LUÍS CAETANO PAQUETE', 'LUÍS CAETANO PAQUETE', null, '001251M04', '1KZT7S4', 'MALE', '2004-11-10', 'Angola', null, 23),
  ('000566M01', 'bravos', 'Caprego', 'FILIPE PREGO CANDUMBO', 'Caprego', '000566M01', '1JXIA30', 'MALE', '2001-01-26', 'Angola', null, 24),
  ('000488M98', 'bravos', 'JORGE CORREIA', 'JORGE CORREIA', null, '000488M98', '1JTV8J9', 'MALE', '1998-05-12', 'Angola', null, 19),
  ('000728M01', 'bravos', 'Higino Epalanga', 'Higino Epalanga', null, '000728M01', '1K08PH7', 'MALE', '2001-05-05', 'Angola', null, 10),
  ('001093M96', 'bravos', 'Joffre Faztudo', 'Joffre Faztudo', null, '001093M96', '1K2WKF7', 'MALE', '1996-10-17', 'Angola', null, 20),
  ('001160M03', 'bravos', 'LUÍS VENÂNCIO FELICIANO DIREITO', 'LUÍS VENÂNCIO FELICIANO DIREITO', null, '001160M03', '1KADLE6', 'MALE', '2003-06-22', 'Angola', null, 14),
  ('002718M05', 'bravos', 'Edmilson Paulo Generoso', 'Edmilson Paulo Generoso', null, '002718M05', '1M8Y3D4', 'MALE', '2005-07-29', 'Angola', null, 29),
  ('000958M95', 'bravos', 'Luis Gonçalves', 'Luis Gonçalves', null, '000958M95', '1K1TS02', 'MALE', '1995-01-10', 'Angola', null, 26),
  ('001078M99', 'bravos', 'Eric Manuel Gouveia Cabral', 'Eric Manuel Gouveia Cabral', null, '001078M99', '1K2PZX2', 'MALE', '1999-04-07', 'Angola', null, 8),
  ('002798M06', 'bravos', 'Yubanis Joao', 'Yubanis Joao', null, '002798M06', '1M9KIM9', 'MALE', '2006-02-09', 'Angola', null, 31),
  ('000397M01', 'bravos', 'SANTOS NKIAMBI KIAKU', 'SANTOS NKIAMBI KIAKU', null, '000397M01', '1JRTYH2', 'MALE', '2001-06-06', 'Angola', null, 32),
  ('000717M01', 'bravos', 'Lionardo', 'Belito Batalha Messias', 'Lionardo', '000717M01', '1JZZSE2', 'MALE', '2001-08-23', 'Angola', null, 12),
  ('002715M03', 'bravos', 'Eduwine Alfredo Dos Vantrier', 'Eduwine Alfredo Dos Vantrier', null, '002715M03', '1M8XZV0', 'MALE', '2003-03-05', 'Angola', null, 17),
  ('003079M04', 'bravos', 'Muhongo', 'Andre Dinis', 'Muhongo', '003079M04', '1MQV606', 'MALE', '2004-04-27', 'Angola', null, 21),
  ('003104M00', 'bravos', 'GELSON', 'ATAÍDE BULE NEVES', 'GELSON', '003104M00', '1MRRVA5', 'MALE', '2000-07-16', 'Angola', null, 9),
  ('000369M03', 'bravos', 'DANILSON JOSÉ PEDRO ALBERTO', 'DANILSON JOSÉ PEDRO ALBERTO', null, '000369M03', '1JRKRJ7', 'MALE', '2003-03-20', 'Angola', null, 2),
  ('005446M05', 'bravos', 'MIGUEL JOSÉ SEBASTIÃO', 'MIGUEL JOSÉ SEBASTIÃO', null, '005446M05', '1PZDU59', 'MALE', '2005-09-10', 'Angola', null, 7),
  ('002950M01', 'bravos', 'GASTÃO TANGU', 'GASTÃO TANGU', null, '002950M01', '1MC6W52', 'MALE', '2001-12-28', 'Angola', null, 28),
  ('003103M00', 'bravos', 'CHUKWUMELA BRIGHT OSAH', 'CHUKWUMELA BRIGHT OSAH', null, '003103M00', '1MRRS47', 'MALE', '2000-02-10', 'Nigeria', null, 16),
  ('003075M02', 'bravos', 'Fota', 'Tiago Uzana', 'Fota', '003075M02', '1MQUVZ2', 'MALE', '2002-08-10', 'Angola', null, 15),
  ('008948M04', 'bravos', 'ANTONIO JOSE', 'ANTONIO JOSE', null, '008948M04', '1V0F2V0', 'MALE', '2004-04-05', 'Angola', null, null),
  ('000772M98', 'bravos', 'BRUNO TRINDADE', 'BRUNO TRINDADE', null, '000772M98', '1K0RPZ2', 'MALE', '1998-11-26', 'Angola', null, null)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Sagrada Esperança — 53 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('002482M07', 'sagrada', 'Charles Abel', 'Charles Abel', null, '002482M07', '1M6AMJ6', 'MALE', '2007-01-26', 'Angola', null, null),
  ('004426M06', 'sagrada', 'HAHILO SAPALO ALBERTO', 'HAHILO SAPALO ALBERTO', null, '004426M06', '1PKA0N3', 'MALE', '2006-12-10', 'Angola', null, 32),
  ('001558M03', 'sagrada', 'CLAUDIO BARBOSA', 'CLAUDIO BARBOSA', null, '001558M03', '1L7VM13', 'MALE', '2003-09-26', 'Angola', null, 33),
  ('007614M00', 'sagrada', 'MIGUEL ANSELMO BASILIO DANIEL', 'MIGUEL ANSELMO BASILIO DANIEL', null, '007614M00', '1TD23W7', 'MALE', '2000-01-28', 'Angola', null, 5),
  ('000359M95', 'sagrada', 'CABUÇO', 'GUILHERME FRANCISCO SAIENDO', 'CABUÇO', '000359M95', '1JRJ1Y6', 'MALE', '1995-05-04', 'Angola', null, 8),
  ('000365M03', 'sagrada', 'FELISBERTO AUGUSTO CALUMBULA', 'FELISBERTO AUGUSTO CALUMBULA', null, '000365M03', '1JRKMF2', 'MALE', '2003-08-12', 'Angola', null, 35),
  ('004425M06', 'sagrada', 'CARLOS NEVES CAMOXI', 'CARLOS NEVES CAMOXI', null, '004425M06', '1PKA0K6', 'MALE', '2006-04-15', 'Angola', null, null),
  ('004424M07', 'sagrada', 'CAPANDA', 'HENRIQUES AMERICO HENDA', 'CAPANDA', '004424M07', '1PKA0G6', 'MALE', '2007-03-12', 'Angola', null, null),
  ('008304M09', 'sagrada', 'ALFINO GOMES CHIDI PINTO', 'ALFINO GOMES CHIDI PINTO', null, '008304M09', '1URVKN2', 'MALE', '2009-04-22', 'Angola', null, null),
  ('008350M07', 'sagrada', 'FERNANDO', 'ANTÓNIO SOZINHO CHORA', 'FERNANDO', '008350M07', '1USLHA9', 'MALE', '2007-04-29', 'Angola', null, null),
  ('000418M01', 'sagrada', 'Dala', 'Melone Moundo', 'Dala', '000418M01', '1JRXXR0', 'MALE', '2001-08-25', 'Angola', null, 11),
  ('008233M10', 'sagrada', 'DE DEUS', 'DADINHO INOCÊNCIO AUGUSTO', 'DE DEUS', '008233M10', '1URL4K5', 'MALE', '2010-09-29', 'Angola', null, null),
  ('001414M95', 'sagrada', 'Dodão', 'Adilson Miguel Sebastião', 'Dodão', '001414M95', '1L3L5Q7', 'MALE', '1995-12-08', 'Angola', null, 19),
  ('000961M89', 'sagrada', 'Bartolomeu Domingos', 'Bartolomeu Domingos', null, '000961M89', '1K1TTP0', 'MALE', '1989-01-30', 'Angola', null, 14),
  ('002193M01', 'sagrada', 'Silvano Mauro Dos Santos', 'Silvano Mauro Dos Santos', null, '002193M01', '1LJUG83', 'MALE', '2001-01-17', 'Angola', null, 18),
  ('007245M00', 'sagrada', 'SIMÃO', 'NSESANI EMANUEL', 'SIMÃO', '007245M00', '1SPU5F2', 'MALE', '2000-11-05', 'Angola', null, 12),
  ('008019M08', 'sagrada', 'ESCALÃO DE FORMAÇÃO', 'NZUNZI GARCIA', 'ESCALÃO DE FORMAÇÃO', '008019M08', '1UNK8M4', 'MALE', '2008-04-01', 'Angola', null, null),
  ('008296M09', 'sagrada', 'CONGOLO', 'ADILSON NDAMBO FATIMA', 'CONGOLO', '008296M09', '1URVIY3', 'MALE', '2009-11-28', 'Angola', null, null),
  ('008300M09', 'sagrada', 'FAUSTINO', 'JÚLIO CAPALO', 'FAUSTINO', '008300M09', '1URVJV7', 'MALE', '2009-12-01', 'Angola', null, null),
  ('002939M07', 'sagrada', 'ANTÓNIO', 'OSVALDO SANTOS FLORINDA', 'ANTÓNIO', '002939M07', '1MBH2K9', 'MALE', '2007-12-12', 'Angola', null, 36),
  ('000962M02', 'sagrada', 'FRANCISCO LUCUSSA', 'JORGE TXANDO', 'FRANCISCO LUCUSSA', '000962M02', '1K1U3Y8', 'MALE', '2002-03-13', 'Angola', null, 9),
  ('008063M08', 'sagrada', 'GARCIAS', 'NZUZI PANZO', 'GARCIAS', '008063M08', '1UQB0P5', 'MALE', '2008-04-01', 'Angola', null, null),
  ('008051M08', 'sagrada', 'GUERRA', 'ELISIO SARAFIM', 'GUERRA', '008051M08', '1UQ15W5', 'MALE', '2008-03-24', 'Angola', null, null),
  ('002887M06', 'sagrada', 'MUACHEFO', 'MARCOS FRANCISCO JOÃO', 'MUACHEFO', '002887M06', '1MAFU72', 'MALE', '2006-06-22', 'Angola', null, null),
  ('006691M07', 'sagrada', 'JOÃO MUBANGA', 'NGOI KATABU', 'JOÃO MUBANGA', '006691M07', '1SCB285', 'MALE', '2007-02-16', 'Angola', null, null),
  ('002857M05', 'sagrada', 'PINTO', 'ADILSON MÁRIO JORGE', 'PINTO', '002857M05', '1MA5QH8', 'MALE', '2005-12-11', 'Angola', null, 15),
  ('007162M07', 'sagrada', 'MAITONYI', 'FERNANDO CAHILO JOSÉ', 'MAITONYI', '007162M07', '1SD9KJ0', 'MALE', '2007-04-18', 'Angola', null, null),
  ('008062M07', 'sagrada', 'Junior Neves', 'Francisco Neves', 'Junior Neves', '008062M07', '1UQB020', 'MALE', '2007-05-02', 'Angola', null, null),
  ('000405M05', 'sagrada', 'DOMINGOS JOSÉ KANDUMBA', 'DOMINGOS JOSÉ KANDUMBA', null, '000405M05', '1JRV034', 'MALE', '2005-08-20', 'Angola', null, 34),
  ('004423M07', 'sagrada', 'KAPUITA', 'ZACARIAS MUZAULA', 'KAPUITA', '004423M07', '1PKA0D1', 'MALE', '2007-07-05', 'Angola', null, null),
  ('000322M95', 'sagrada', 'EVARISTO KAPUNGE', 'EVARISTO KAPUNGE', null, '000322M95', '1JJFMV6', 'MALE', '1996-04-04', 'Angola', null, 4),
  ('007163M08', 'sagrada', 'LAURINDA MBUMBUM', 'PALANGA TXITEMBO', 'LAURINDA MBUMBUM', '007163M08', '1SD9KL1', 'MALE', '2008-02-22', 'Angola', null, null),
  ('001539M04', 'sagrada', 'ADOLFO LOUA', 'ADOLFO LOUA', null, '001539M04', '1L7LPP2', 'MALE', '2004-08-03', 'Angola', null, 30),
  ('008018M08', 'sagrada', 'SAMUEL LUKENGANI', 'SAMUEL LUKENGANI', null, '008018M08', '1UNK8K8', 'MALE', '2008-02-13', 'Angola', null, null),
  ('000938M00', 'sagrada', 'AFONSO MARQUES', 'AFONSO MARQUES', null, '000938M00', '1K1SFB7', 'MALE', '2000-03-12', 'Angola', null, 24),
  ('002712M04', 'sagrada', 'MAURÍCIO ANDRÉ', 'SAPALO CAIPUZO', 'MAURÍCIO ANDRÉ', '002712M04', '1M8XGW3', 'MALE', '2004-01-15', 'Angola', null, 31),
  ('000345M99', 'sagrada', 'MIRANDA', 'SIMONE EDUARDO ASSA', 'MIRANDA', '000345M99', '1JRBDZ5', 'MALE', '1999-12-23', 'Angola', null, 10),
  ('002891M07', 'sagrada', 'TXIGICA MUANDANGE', 'TXIGICA MUANDANGE', null, '002891M07', '1MAFV58', 'MALE', '2007-01-22', 'Angola', null, null),
  ('001068M95', 'sagrada', 'Muanha', 'Joao Ngunza', 'Muanha', '001068M95', '1K2PFQ2', 'MALE', '1995-06-06', 'Angola', null, 17),
  ('002888M06', 'sagrada', 'MUATANGUI', 'ADILSON CAXALA', 'MUATANGUI', '002888M06', '1MAFUD3', 'MALE', '2006-04-04', 'Angola', null, null),
  ('000354M97', 'sagrada', 'LEONARDO ARMANDO MUTUNDA', 'LEONARDO ARMANDO MUTUNDA', null, '000354M97', '1JRC5Q9', 'MALE', '1997-04-16', 'Angola', null, 13),
  ('008052M07', 'sagrada', 'PAULO ALBANO NETO', 'PAULO ALBANO NETO', null, '008052M07', '1UQ17Q5', 'MALE', '2007-12-21', 'Angola', null, null),
  ('001099M98', 'sagrada', 'Barreira Paulo', 'Barreira Paulo', null, '001099M98', '1K2WT15', 'MALE', '1998-03-15', 'Angola', null, 28),
  ('000788M02', 'sagrada', 'Filipe Pimpao', 'Filipe Pimpao', null, '000788M02', '1K0S9H7', 'MALE', '2002-09-09', 'Angola', null, 16),
  ('006690M08', 'sagrada', 'RONALDO', 'CHIMUNA UPITE', 'RONALDO', '006690M08', '1SCB257', 'MALE', '2008-08-05', 'Angola', null, null),
  ('006655M08', 'sagrada', 'SANDRA GONZAGAS', 'BRIGUE DOMINGOS', 'SANDRA GONZAGAS', '006655M08', '1SC9H51', 'MALE', '2008-08-13', 'Angola', null, 29),
  ('000718M94', 'sagrada', 'Sebastiao', 'Felisberto Dala', 'Sebastiao', '000718M94', '1JZZSV7', 'MALE', '1994-05-04', 'Angola', null, 7),
  ('008059M06', 'sagrada', 'SUPULA MUNTO', 'ADÃO MULUMBA', 'SUPULA MUNTO', '008059M06', '1UQ1LN1', 'MALE', '2006-11-12', 'Angola', null, null),
  ('000350M92', 'sagrada', 'TATI', 'LUIS BUMBA', 'TATI', '000350M92', '1JRBVH5', 'MALE', '1992-02-23', 'Angola', null, 20),
  ('008322M06', 'sagrada', 'VIEIGAS SIMÃO', 'MARIA FILIPE', 'VIEIGAS SIMÃO', '008322M06', '1USANV3', 'MALE', '2006-06-23', 'Angola', null, null),
  ('001090M94', 'sagrada', 'MANUEL VUNGE', 'MANUEL VUNGE', null, '001090M94', '1K2VZ98', 'MALE', '1994-04-22', 'Angola', null, 3),
  ('008969M98', 'sagrada', 'ALEXANDRE ABEL FERNANDO', 'ALEXANDRE ABEL FERNANDO', null, '008969M98', '1V1A1U9', 'MALE', '1998-05-25', 'Angola', null, 2),
  ('008962M97', 'sagrada', 'NEVES', 'MESSIAS PIRES', 'NEVES', '008962M97', '1V0Z7L2', 'MALE', '1997-12-10', 'Angola', null, 21)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Desportivo da Lunda Sul — 79 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('008845M11', 'lundasul', 'AFONSO', 'ANTÓNIO EZEQUIEL MUSSAZENO', 'AFONSO', '008845M11', '1UWN5D8', 'MALE', '2011-01-13', 'Angola', null, null),
  ('001130M01', 'lundasul', 'João Ambrosio', 'João Ambrosio', null, '001130M01', '1K3IYT0', 'MALE', '2001-04-19', 'Angola', null, 28),
  ('004821M07', 'lundasul', 'Manuel António', 'Manuel António', null, '004821M07', '1PNQ0B4', 'MALE', '2007-09-01', 'Angola', null, null),
  ('008840M08', 'lundasul', 'Baptista', 'Gustavo Bartolomeu Upuó', 'Baptista', '008840M08', '1UWN4Y7', 'MALE', '2008-01-06', 'Angola', null, null),
  ('005259M07', 'lundasul', 'Trindade Baptista', 'Trindade Baptista', null, '005259M07', '1PPR5S9', 'MALE', '2007-02-09', 'Angola', null, null),
  ('008836M11', 'lundasul', 'Bernardo', 'Reclénio Paulo Alberto', 'Bernardo', '008836M11', '1UWN4J7', 'MALE', '2011-08-27', 'Angola', null, null),
  ('003236M02', 'lundasul', 'MONGA DIÉ', 'AFONSO MANUEL BINGA', 'MONGA DIÉ', '003236M02', '1MZSFE5', 'MALE', '2002-04-23', 'Angola', null, 23),
  ('001256M95', 'lundasul', 'Zau', 'Joao Bivoba', 'Zau', '001256M95', '1KZTHB4', 'MALE', '1995-07-16', 'Angola', null, 35),
  ('003058M04', 'lundasul', 'Isaac BOMASHI', 'Isaac BOMASHI', null, '003058M04', '1MPTGZ2', 'MALE', '2004-07-21', 'Angola', null, null),
  ('002942M06', 'lundasul', 'José Bondoso', 'José Bondoso', null, '002942M06', '1MBIUP4', 'MALE', '2006-11-11', 'Angola', null, null),
  ('000639M97', 'lundasul', 'CACHINDELE', 'MANUEL TCHINHANGUITA', 'CACHINDELE', '000639M97', '1JZ48I2', 'MALE', '1997-11-04', 'Angola', null, 19),
  ('006650M06', 'lundasul', 'JOAO CAEBO', 'JOAO CAEBO', null, '006650M06', '1SC9AT7', 'MALE', '2006-06-17', 'Angola', null, null),
  ('001178M03', 'lundasul', 'caluvili', 'joão Silvano', 'caluvili', '001178M03', '1KF4FA8', 'MALE', '2003-08-16', 'Angola', null, 33),
  ('002943M07', 'lundasul', 'Sergio CAPENDA', 'Sergio CAPENDA', null, '002943M07', '1MBIUU0', 'MALE', '2007-01-02', 'Angola', null, null),
  ('000764M96', 'lundasul', 'João Baptista Cassicote', 'João Baptista Cassicote', null, '000764M96', '1K0RA31', 'MALE', '1996-08-14', 'Angola', null, 27),
  ('008852M10', 'lundasul', 'CASSINDA', 'RAIMUNDO EPALANGA', 'CASSINDA', '008852M10', '1UWN5Y1', 'MALE', '2010-08-30', 'Angola', null, null),
  ('006637M08', 'lundasul', 'JOAO CATORZE', 'JOAO CATORZE', null, '006637M08', '1SC9A08', 'MALE', '2008-10-09', 'Angola', null, null),
  ('006634M08', 'lundasul', 'AJAIR CAZENGA', 'AJAIR CAZENGA', null, '006634M08', '1SC99X3', 'MALE', '2008-06-10', 'Angola', null, null),
  ('006649M09', 'lundasul', 'AIRES CHICUNJI', 'AIRES CHICUNJI', null, '006649M09', '1SC9AR5', 'MALE', '2009-08-04', 'Angola', null, null),
  ('006648M11', 'lundasul', 'ALVES CHICUNJI', 'ALVES CHICUNJI', null, '006648M11', '1SC9AQ4', 'MALE', '2011-05-28', 'Angola', null, null),
  ('008839M10', 'lundasul', 'Chitazo', 'Custódio Txifita', 'Chitazo', '008839M10', '1UWN4V0', 'MALE', '2010-11-11', 'Angola', null, null),
  ('008858M11', 'lundasul', 'BAIÃO DA SILVA', 'ANSELMO CAETANO', 'BAIÃO DA SILVA', '008858M11', '1UWN6S6', 'MALE', '2011-09-03', 'Angola', null, null),
  ('008841M10', 'lundasul', 'Da Silva', 'Mauro Zeferino', 'Da Silva', '008841M10', '1UWN539', 'MALE', '2010-07-24', 'Angola', null, null),
  ('008846M09', 'lundasul', 'FIGUEIRA DALA', 'JARELSON ARICLENES', 'FIGUEIRA DALA', '008846M09', '1UWN5G7', 'MALE', '2009-05-28', 'Angola', null, null),
  ('000789M02', 'lundasul', 'BICHO', 'Ervinecio Daniel', 'BICHO', '000789M02', '1K0S9K6', 'MALE', '2002-03-06', 'Angola', null, null),
  ('006631M05', 'lundasul', 'CLAÚDIO DANIEL', 'CLAÚDIO DANIEL', null, '006631M05', '1SC99S4', 'MALE', '2005-09-27', 'Angola', null, 37),
  ('006687M06', 'lundasul', 'MANUEL DANIEL', 'MANUEL DANIEL', null, '006687M06', '1SC9TV6', 'MALE', '2006-05-23', 'Angola', null, null),
  ('002880M04', 'lundasul', 'Tomás Dias', 'Tomás Dias', null, '002880M04', '1MAF7V8', 'MALE', '2004-07-30', 'Angola', null, 41),
  ('006688M06', 'lundasul', 'JORGE DOS SANTOS', 'JORGE DOS SANTOS', null, '006688M06', '1SC9UG9', 'MALE', '2006-07-25', 'Angola', null, null),
  ('006638M08', 'lundasul', 'MUCUTA ELIAS', 'MUCUTA ELIAS', null, '006638M08', '1SC9A19', 'MALE', '2008-02-01', 'Angola', null, null),
  ('008844M12', 'lundasul', 'Jorge Feliciano', 'André Sumano', 'Jorge Feliciano', '008844M12', '1UWN5B4', 'MALE', '2012-12-13', 'Angola', null, null),
  ('007030M09', 'lundasul', 'AMORIM FILIPE', 'AMORIM FILIPE', null, '007030M09', '1SCSXH4', 'MALE', '2009-09-22', 'Angola', null, null),
  ('000680M97', 'lundasul', 'FELIX HONJO', 'FELIX HONJO', null, '000680M97', '1JZJRG6', 'MALE', '1997-03-20', 'Angola', null, 11),
  ('008847M10', 'lundasul', 'DULCE HOSSI', 'GRAÇA MUCUASSENO', 'DULCE HOSSI', '008847M10', '1UWN5L8', 'MALE', '2010-01-02', 'Angola', null, null),
  ('008837M12', 'lundasul', 'Justa Inhingui', 'João Reis', 'Justa Inhingui', '008837M12', '1UWN4N4', 'MALE', '2012-05-22', 'Angola', null, null),
  ('008859M10', 'lundasul', 'CHÉCHA ITULIQUENO', 'CARLOS SONHI', 'CHÉCHA ITULIQUENO', '008859M10', '1UWNDB3', 'MALE', '2010-02-14', 'Angola', null, null),
  ('008854M10', 'lundasul', 'JAMBA', 'UPITE VICANO', 'JAMBA', '008854M10', '1UWN699', 'MALE', '2010-06-10', 'Angola', null, null),
  ('004813M06', 'lundasul', 'João Joaquim', 'João Joaquim', null, '004813M06', '1PNPPK2', 'MALE', '2006-11-09', 'Angola', null, null),
  ('006641M10', 'lundasul', 'Jovial Justino', 'Jovial Justino', null, '006641M10', '1SC9A97', 'MALE', '2010-05-25', 'Angola', null, null),
  ('000696M96', 'lundasul', 'KETA', 'MARIO BERNARDO', 'KETA', '000696M96', '1JZMGD3', 'MALE', '1996-03-26', 'Angola', null, 26),
  ('008848M10', 'lundasul', 'LEONARDO', 'CANDA IVONE', 'LEONARDO', '008848M10', '1UWN5R0', 'MALE', '2010-12-20', 'Angola', null, null),
  ('004815M06', 'lundasul', 'Veríssimo Loloji', 'Veríssimo Loloji', null, '004815M06', '1PNPX79', 'MALE', '2006-10-12', 'Angola', null, null),
  ('002588M06', 'lundasul', 'Tchilihi Luamba', 'Jairo de Sousa', 'Tchilihi Luamba', '002588M06', '1M7I902', 'MALE', '2006-05-10', 'Angola', null, null),
  ('004809M08', 'lundasul', 'Amilton Luifi', 'Amilton Luifi', null, '004809M08', '1PNPPD7', 'MALE', '2008-09-08', 'Angola', null, null),
  ('006643M09', 'lundasul', 'JANUÁRIO MANUEL', 'JANUÁRIO MANUEL', null, '006643M09', '1SC9AG6', 'MALE', '2009-01-05', 'Angola', null, null),
  ('000677M93', 'lundasul', 'OSVALDO MIGUEL', 'OSVALDO MIGUEL', null, '000677M93', '1JZJI14', 'MALE', '1993-02-26', 'Angola', null, 8),
  ('006645M09', 'lundasul', 'WAMANA MOÇAMBIQUE', 'WAMANA MOÇAMBIQUE', null, '006645M09', '1SC9AK6', 'MALE', '2009-02-10', 'Angola', null, null),
  ('006647M09', 'lundasul', 'Zango Muachissengue', 'Zango Muachissengue', null, '006647M09', '1SC9AP0', 'MALE', '2009-09-23', 'Angola', null, null),
  ('004804M07', 'lundasul', 'Vidal Muachissengue', 'Vidal Muachissengue', null, '004804M07', '1PNPP32', 'MALE', '2007-11-12', 'Angola', null, null),
  ('004817M08', 'lundasul', 'Felix Mukenie', 'Felix Mukenie', null, '004817M08', '1PNPZN4', 'MALE', '2008-02-09', 'Angola', null, null),
  ('000794M01', 'lundasul', 'NIONGONONA MULIQUITA', 'NIONGONONA MULIQUITA', null, '000794M01', '1K0SAB2', 'MALE', '2001-09-07', 'Angola', null, 2),
  ('006628M10', 'lundasul', 'MANOWA MULONGA', 'MANOWA MULONGA', null, '006628M10', '1SC99N0', 'MALE', '2010-02-25', 'Angola', null, null),
  ('006644M09', 'lundasul', 'HENRIQUES MUTAMBULENO', 'HENRIQUES MUTAMBULENO', null, '006644M09', '1SC9AJ0', 'MALE', '2009-10-01', 'Angola', null, null),
  ('000529M99', 'lundasul', 'NGULU', 'ANTONIO NGOLA', 'NGULU', '000529M99', '1JWT8S6', 'MALE', '1999-07-09', 'Angola', null, 17),
  ('000567M00', 'lundasul', 'PAULINO', 'ELINDO WANGA', 'PAULINO', '000567M00', '1JXIAL6', 'MALE', '2000-01-07', 'Angola', null, 6),
  ('002878M04', 'lundasul', 'Atavares Pinto', 'Atavares Pinto', null, '002878M04', '1MAF102', 'MALE', '2004-04-10', 'Angola', null, 34),
  ('006636M10', 'lundasul', 'ANSELMO RAIMUNDO', 'ANSELMO RAIMUNDO', null, '006636M10', '1SC99Z6', 'MALE', '2010-12-15', 'Angola', null, null),
  ('000784M04', 'lundasul', 'INOCENCIO RUI', 'INOCENCIO RUI', null, '000784M04', '1K0S908', 'MALE', '2004-03-30', 'Angola', null, 7),
  ('004807M07', 'lundasul', 'João Sacaputo', 'João Sacaputo', null, '004807M07', '1PNPP86', 'MALE', '2007-01-01', 'Angola', null, null),
  ('008856M11', 'lundasul', 'AFONSO SAMAIUQUE', 'AMILCAR LUCAS', 'AFONSO SAMAIUQUE', '008856M11', '1UWN6K0', 'MALE', '2011-08-12', 'Angola', null, null),
  ('008860M09', 'lundasul', 'MUAFUNGA SAMALACA', 'IVANO DE OLIVEIRA', 'MUAFUNGA SAMALACA', '008860M09', '1UWNDE5', 'MALE', '2009-05-23', 'Angola', null, null),
  ('004811M08', 'lundasul', 'Eliseu Samuzeca', 'Eliseu Samuzeca', null, '004811M08', '1PNPPF9', 'MALE', '2008-02-15', 'Angola', null, null),
  ('006635M10', 'lundasul', 'ADMIRO SANJAMBA', 'ADMIRO SANJAMBA', null, '006635M10', '1SC99Y8', 'MALE', '2010-08-28', 'Angola', null, null),
  ('008851M11', 'lundasul', 'CAMUOIO SANTOMEIA', 'BENVINDO IAMUNO', 'CAMUOIO SANTOMEIA', '008851M11', '1UWN5X8', 'MALE', '2011-05-02', 'Angola', null, null),
  ('008849M12', 'lundasul', 'DA CRUZ AUGUSTO SECRETÁRIO', 'LUITXI JORGE', 'DA CRUZ AUGUSTO SECRETÁRIO', '008849M12', '1UWN5T3', 'MALE', '2012-04-15', 'Angola', null, null),
  ('000766M96', 'lundasul', 'Joao Tchiginga', 'Joao Tchiginga', null, '000766M96', '1K0RDY8', 'MALE', '1996-08-23', 'Angola', null, 4),
  ('008855M11', 'lundasul', 'TITO', 'TÁRCIO CRISTIANO', 'TITO', '008855M11', '1UWN6F7', 'MALE', '2011-05-24', 'Angola', null, null),
  ('008857M11', 'lundasul', 'AFONSO TXICATA', 'BRÁULIO MICHEL', 'AFONSO TXICATA', '008857M11', '1UWN6N7', 'MALE', '2011-12-26', 'Angola', null, null),
  ('008838M08', 'lundasul', 'Upale Txitoma', 'Horácio do Rosário', 'Upale Txitoma', '008838M08', '1UWN4S5', 'MALE', '2008-07-12', 'Angola', null, null),
  ('001064M99', 'lundasul', 'Sicuba Vunge', 'Maranata Domingos', 'Sicuba Vunge', '001064M99', '1K2PC87', 'MALE', '1999-12-08', 'Angola', null, 10),
  ('002944M06', 'lundasul', 'António Vungo', 'António Vungo', null, '002944M06', '1MBIWP2', 'MALE', '2006-07-14', 'Angola', null, null),
  ('000786M00', 'lundasul', 'ADALBERTO WACAMBA', 'ADALBERTO WACAMBA', null, '000786M00', '1K0S970', 'MALE', '2000-08-20', 'Angola', null, 12),
  ('008850M11', 'lundasul', 'NDONGALA XILI', 'MANUEL AFONSO', 'NDONGALA XILI', '008850M11', '1UWN5V2', 'MALE', '2011-09-27', 'Angola', null, null),
  ('001581M95', 'lundasul', 'Domingos Ximba', 'Domingos Ximba', null, '001581M95', '1L963X5', 'MALE', '1995-03-29', 'Angola', null, 16),
  ('001070M93', 'lundasul', 'David', 'Dieu Maquissossila', 'David', '001070M93', '1K2PH45', 'MALE', '1993-06-16', 'Angola', null, 25),
  ('001069M01', 'lundasul', 'Singongo', 'Frederico Xangongo', 'Singongo', '001069M01', '1K2PGL3', 'MALE', '2001-10-11', 'Angola', null, 5),
  ('000669M91', 'lundasul', 'JOAQUIM TEIXEIRA', 'JOAQUIM TEIXEIRA', null, '000669M91', '1JZIZU3', 'MALE', '1991-07-20', 'Angola', null, 20),
  ('001092M00', 'lundasul', 'AGOSTINHO', 'PEDRO DOMINGOS', 'AGOSTINHO', '001092M00', '1K2WAI2', 'MALE', '2000-07-30', 'Angola', null, 30),
  ('000894M03', 'lundasul', 'Nguala', 'Hanilton Cassueca', 'Nguala', '000894M03', '1K1K2V2', 'MALE', '2003-05-06', 'Angola', null, 3)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- São Salvador — 34 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('007418M97', 'saosalvador', 'JOÃO ADRIANO', 'JOÃO ADRIANO', null, '007418M97', '1T64MH7', 'MALE', '1997-03-25', 'Angola', 'FWD', 3),
  ('005417M02', 'saosalvador', 'PACHECO GUILHERME FRANCISCO ALFREDO', 'PACHECO GUILHERME FRANCISCO ALFREDO', null, '005417M02', '1PX5ZQ4', 'MALE', '2002-03-10', 'Angola', 'MF', 15),
  ('002227M00', 'saosalvador', 'MANUEL VIEIRA ALMEIDA', 'MANUEL VIEIRA ALMEIDA', null, '002227M00', '1LJVYF9', 'MALE', '2000-04-26', 'Angola', 'DF', 16),
  ('004918M05', 'saosalvador', 'AFONSO LUKOMBO ANTONIO', 'AFONSO LUKOMBO ANTONIO', null, '004918M05', '1PNY3G2', 'MALE', '2005-07-10', 'Angola', 'FWD', 9),
  ('003152M00', 'saosalvador', 'Matondo Kuanzambi Jose Bengi', 'Matondo Kuanzambi Jose Bengi', null, '003152M00', '1MUBKP5', 'MALE', '2000-06-06', 'Angola', 'GK', 1),
  ('001065M99', 'saosalvador', 'Samuel Chissapa Cachimbombo', 'Samuel Chissapa Cachimbombo', null, '001065M99', '1K2PDB8', 'MALE', '1999-04-20', 'Angola', 'FWD', 21),
  ('000815M99', 'saosalvador', 'JUSTINO TCHITEPA CÉSAR', 'JUSTINO TCHITEPA CÉSAR', null, '000815M99', '1K12NM6', 'MALE', '1999-08-01', 'Angola', 'MF', 27),
  ('000665M93', 'saosalvador', 'MANUEL DE MATOS', 'MANUEL DE MATOS', null, '000665M93', '1JZIRZ7', 'MALE', '1993-08-01', 'Angola', 'MF', 4),
  ('000937M02', 'saosalvador', 'BATOMENE DE SOUSA', 'BATOMENE DE SOUSA', null, '000937M02', '1K1SEV5', 'MALE', '2002-12-25', 'Angola', 'FWD', 7),
  ('001937M02', 'saosalvador', 'FECA', 'AUGUSTO FECAYAMALE', 'FECA', '001937M02', '1LIH9V9', 'MALE', '2002-10-01', 'Angola', 'DF', 5),
  ('001899M99', 'saosalvador', 'BIJO', 'Fernando Lizandro Firmino Camuege Fernando', 'BIJO', '001899M99', '1LIH506', 'MALE', '1999-10-09', 'Angola', 'MF', 6),
  ('003615M06', 'saosalvador', 'Lando Simao Filipe', 'Lando Simao Filipe', null, '003615M06', '1NG0F78', 'MALE', '2006-11-24', 'Angola', 'FWD', 14),
  ('002020M02', 'saosalvador', 'ARTUR FIRMINO', 'ARTUR FIRMINO', null, '002020M02', '1LIWQF9', 'MALE', '2002-05-18', 'Angola', 'DF', 34),
  ('001216M99', 'saosalvador', 'José Garcia', 'José Garcia', null, '001216M99', '1KZ4H82', 'MALE', '1999-02-22', 'Angola', 'DF', 2),
  ('007311M03', 'saosalvador', 'CAETANO GOMES', 'CAETANO GOMES', null, '007311M03', '1SWD8D7', 'MALE', '2003-08-13', 'Angola', 'FWD', 30),
  ('002234M04', 'saosalvador', 'JOÃO KUANZAMBI LUKOMBO JUNIOR', 'JOÃO KUANZAMBI LUKOMBO JUNIOR', null, '002234M04', '1LJW6R1', 'MALE', '2004-10-05', 'Angola', 'FWD', 32),
  ('002242M91', 'saosalvador', 'ANTÓNIO JOSÉ XAVIEI JUNIOR', 'ANTÓNIO JOSÉ XAVIEI JUNIOR', null, '002242M91', '1LJWBM7', 'MALE', '1991-11-12', 'Angola', 'DF', 11),
  ('000403M05', 'saosalvador', 'ARICLENES CARLOS LOPES ANTÓNIO', 'ARICLENES CARLOS LOPES ANTÓNIO', null, '000403M05', '1JRUTW6', 'MALE', '2005-03-19', 'Angola', 'MF', 10),
  ('001892M01', 'saosalvador', 'LUQUINHAS', 'Lucas Filemon Cassule Lucas', 'LUQUINHAS', '001892M01', '1LIH3R9', 'MALE', '2001-07-14', 'Angola', 'FWD', 17),
  ('000485M99', 'saosalvador', 'FRANCISCO MANGALA', 'FRANCISCO MANGALA', null, '000485M99', '1JTV5A6', 'MALE', '1999-07-08', 'Angola', 'GK', 12),
  ('001011M98', 'saosalvador', 'António Joaquim Mateus', 'António Joaquim Mateus', null, '001011M98', '1K29464', 'MALE', '1998-03-14', 'Angola', 'GK', 31),
  ('000946M04', 'saosalvador', 'EDUARDO MOYO', 'EDUARDO MOYO', null, '000946M04', '1K1SM82', 'MALE', '2004-10-20', 'Angola', 'MF', 22),
  ('001102M92', 'saosalvador', 'Pedro Moyo', 'Pedro Moyo', null, '001102M92', '1K2WUE9', 'MALE', '1992-07-28', 'Angola', 'GK', 35),
  ('005959M05', 'saosalvador', 'Felix Gonga Muondo', 'Felix Gonga Muondo', null, '005959M05', '1QPT743', 'MALE', '2005-03-16', 'Angola', 'MF', 19),
  ('002280M98', 'saosalvador', 'PAULO AMADEU PANDA', 'PAULO AMADEU PANDA', null, '002280M98', '1LJZ672', 'MALE', '1998-06-30', 'Angola', 'MF', 18),
  ('003658M06', 'saosalvador', 'JONAS RODRIGUES', 'JONAS RODRIGUES', null, '003658M06', '1NIZQE4', 'MALE', '2006-01-22', 'Angola', 'DF', 23),
  ('002136M94', 'saosalvador', 'LUTONDA JOÃO SEBASTIÃO', 'LUTONDA JOÃO SEBASTIÃO', null, '002136M94', '1LJ6Z32', 'MALE', '1994-08-08', 'Angola', 'FWD', 33),
  ('007271M04', 'saosalvador', 'WILSON GONÇALVES TENETE', 'WILSON GONÇALVES TENETE', null, '007271M04', '1SR5RK8', 'MALE', '2004-05-25', 'Angola', 'DF', 25),
  ('001901M03', 'saosalvador', 'Ramilton', 'Rafael Sete Ucuahamba Ucuahamba', 'Ramilton', '001901M03', '1LIH5K4', 'MALE', '2003-03-15', 'Angola', 'DF', 13),
  ('001121M96', 'saosalvador', 'JOÃO ANDRÉ VEMBA', 'JOÃO ANDRÉ VEMBA', null, '001121M96', '1K39MY6', 'MALE', '1996-10-29', 'Angola', 'MF', 8),
  ('002223M91', 'saosalvador', 'NGINAKANDA ANTÓNIO VICENTE', 'NGINAKANDA ANTÓNIO VICENTE', null, '002223M91', '1LJVXK1', 'MALE', '1991-03-23', 'Angola', 'DF', 20),
  ('007796M06', 'saosalvador', 'CONSTANTINO JOSÉ DOMINGOS', 'CONSTANTINO JOSÉ DOMINGOS', null, '007796M06', '1THB252', 'MALE', '2006-06-23', 'Angola', 'MF', 28),
  ('007149M05', 'saosalvador', 'RIVALDO SANTOS PACHECO', 'RIVALDO SANTOS PACHECO', null, '007149M05', '1SD3TM3', 'MALE', '2005-06-05', 'Angola', 'MF', 29),
  ('001076M02', 'saosalvador', 'Anderson de Jesus Luís Mputa', 'Anderson de Jesus Luís Mputa', null, '001076M02', '1K2PYW6', 'MALE', '2002-10-17', 'Angola', 'FWD', 26)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Petro de Luanda — 28 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000725M03', 'petro', 'Ruben Constantino Adérito', 'Ruben Constantino Adérito', null, '000725M03', '1K00C14', 'MALE', '2003-05-17', 'Angola', 'DF', 4),
  ('002653M09', 'petro', 'JAIRO ANTÓNIO BENTO MUANHA', 'JAIRO ANTÓNIO BENTO MUANHA', null, '002653M09', '1M7J6S8', 'MALE', '2009-03-15', 'Angola', 'MF', 34),
  ('002657M08', 'petro', 'ILÍDIO AUGUSTO BUNGA PANDA', 'ILÍDIO AUGUSTO BUNGA PANDA', null, '002657M08', '1M7J786', 'MALE', '2008-07-06', 'Angola', 'FWD', 33),
  ('002000M06', 'petro', 'DOMINGOS DA SILVA', 'DOMINGOS DA SILVA', null, '002000M06', '1LILKA2', 'MALE', '2006-01-23', 'Angola', 'GK', 38),
  ('007685M08', 'petro', 'LOURENÇO JOSÉ DIDISSA', 'LOURENÇO JOSÉ DIDISSA', null, '007685M08', '1TDZZ59', 'MALE', '2008-06-28', 'Angola', 'DF', 31),
  ('007212M99', 'petro', 'TIAGO RODRIGUES DOS REIS', 'TIAGO RODRIGUES DOS REIS', null, '007212M99', '1SG1LJ5', 'MALE', '1999-08-14', 'Brazil', 'FWD', 23),
  ('006014M09', 'petro', 'GABRIEL HEITOR FERNANDES DA SILVA', 'GABRIEL HEITOR FERNANDES DA SILVA', null, '006014M09', '1QSE2M8', 'MALE', '2009-04-10', 'Angola', 'MF', 39),
  ('007211M98', 'petro', 'JORGE JAVIER MOREIRA PEREIRA', 'JORGE JAVIER MOREIRA PEREIRA', null, '007211M98', '161UX74', 'MALE', '1998-03-10', 'Venezuela', 'MF', 20),
  ('002920M96', 'petro', 'JONATHAN JOSUE RUBIO TORO', 'JONATHAN JOSUE RUBIO TORO', null, '002920M96', '1MAV9X0', 'MALE', '1996-10-21', 'Honduras', 'MF', 8),
  ('008901M93', 'petro', 'IVAN RICARDO NEVES ABREU CAVALEIRO', 'IVAN RICARDO NEVES ABREU CAVALEIRO', null, '008901M93', '1UXPX68', 'MALE', '1993-10-18', 'Angola', 'FWD', 7),
  ('008903M97', 'petro', 'MÁRIO CÉSAR AZEVEDO ALVES BALBÚRDIA', 'MÁRIO CÉSAR AZEVEDO ALVES BALBÚRDIA', null, '008903M97', '1UXR9B1', 'MALE', '1997-08-19', 'Angola', 'MF', 6),
  ('008899M98', 'petro', 'LEONARDO DA COSTA BOLGADO', 'LEONARDO DA COSTA BOLGADO', null, '008899M98', '1UXPUT6', 'MALE', '1998-08-20', 'Brazil', 'DF', 5),
  ('000729M98', 'petro', 'Agostinho José Júlio Calunga', 'Agostinho José Júlio Calunga', null, '000729M98', '1K00RB8', 'MALE', '1998-06-10', 'Angola', 'GK', 30),
  ('000430M93', 'petro', 'Adilson Cipriano da Cruz', 'Adilson Cipriano da Cruz', null, '000430M93', '1JS6PZ2', 'MALE', '1993-12-16', 'Angola', 'GK', 22),
  ('000400M98', 'petro', 'JOAQUIM MARCOS CUNGA BALANGA', 'JOAQUIM MARCOS CUNGA BALANGA', null, '000400M98', '1JRU3Z0', 'MALE', '1998-03-13', 'Angola', 'DF', 24),
  ('008895M03', 'petro', 'BERNARDO SILVA DA CONCEIÇÃO', 'BERNARDO SILVA DA CONCEIÇÃO', null, '008895M03', '161X604', 'MALE', '2003-09-15', 'Angola', 'DF', 13),
  ('008891M94', 'petro', 'HÉLDER WANDER SOUSA DE AZEVEDO COSTA', 'HÉLDER WANDER SOUSA DE AZEVEDO COSTA', null, '008891M94', '163UUQ3', 'MALE', '1994-01-12', 'Angola', 'FWD', 11),
  ('008893M93', 'petro', 'LUCAS EDUARDO DOS SANTOS JOÃO', 'LUCAS EDUARDO DOS SANTOS JOÃO', null, '008893M93', '1UXEGR7', 'MALE', '1993-09-04', 'Angola', 'FWD', 9),
  ('008900M96', 'petro', 'DEYBI ALDAIR FLORES FLORES', 'DEYBI ALDAIR FLORES FLORES', null, '008900M96', '1UXPV54', 'MALE', '1996-06-16', 'Honduras', 'MF', 12),
  ('000376M86', 'petro', 'HUGO MIGUEL BARRETO HENRIQUES MARQUES', 'HUGO MIGUEL BARRETO HENRIQUES MARQUES', null, '000376M86', '1JRRJV7', 'MALE', '1986-01-15', 'Angola', 'GK', 1),
  ('000427M01', 'petro', 'Antonio da Silva Chitanga Hossi', 'Antonio da Silva Chitanga Hossi', null, '000427M01', '1JS6M71', 'MALE', '2001-06-12', 'Angola', 'DF', 27),
  ('000384M88', 'petro', 'TIAGO LIMA LEAL', 'TIAGO LIMA LEAL', null, '000384M88', '1JRT100', 'MALE', '1988-03-26', 'Brazil', 'FWD', 26),
  ('000454M00', 'petro', 'LAURINDO DILSON MARIA AURÉLIO', 'LAURINDO DILSON MARIA AURÉLIO', null, '000454M00', '1JSP4X7', 'MALE', '2000-01-08', 'Angola', 'FWD', 29),
  ('008892M95', 'petro', 'NURIO DOMINGOS MATIAS FORTUNA', 'NURIO DOMINGOS MATIAS FORTUNA', null, '008892M95', '1UXEFI2', 'MALE', '1995-03-24', 'Angola', 'DF', 2),
  ('000398M94', 'petro', 'EDDIE MARCOS MELO AFONSO', 'EDDIE MARCOS MELO AFONSO', null, '000398M94', '1JRTZ46', 'MALE', '1994-03-07', 'Angola', 'DF', 25),
  ('001019M98', 'petro', 'VICTOR PEDRO NANQUE', 'VICTOR PEDRO NANQUE', null, '001019M98', '1K29HA9', 'MALE', '1998-02-25', 'Angola', 'DF', 18),
  ('005283M95', 'petro', 'PEDRO MIGUEL SANTOS APARÍCIO', 'PEDRO MIGUEL SANTOS APARÍCIO', null, '005283M95', '161U564', 'MALE', '1995-08-22', 'Portugal', 'MF', 10),
  ('002955M99', 'petro', 'VANILSON TITA ZÉU', 'VANILSON TITA ZÉU', null, '002955M99', '1MC76I4', 'MALE', '1999-03-20', 'Angola', 'MF', 17)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- FC Cabinda — 28 jogadores
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000910M03', 'cabinda', 'Ariclenis Afonso Araújo Lede', 'Ariclenis Afonso Araújo Lede', null, '000910M03', '1K1LE69', 'MALE', '2003-03-27', 'Angola', 'FWD', 29),
  ('007602M07', 'cabinda', 'CORNELIO QUEBA LELO BAPTISTA', 'CORNELIO QUEBA LELO BAPTISTA', null, '007602M07', '1TC8VR0', 'MALE', '2007-01-19', 'Angola', 'MF', 15),
  ('002058M05', 'cabinda', 'FERNANDO MATOMBE BAZONGA', 'FERNANDO MATOMBE BAZONGA', null, '002058M05', '1LIXFQ6', 'MALE', '2005-05-10', 'Angola', 'MF', 21),
  ('002297M97', 'cabinda', 'MARIO ANTONIO BUMBA', 'MARIO ANTONIO BUMBA', null, '002297M97', '1LK64F5', 'MALE', '1997-06-11', 'Angola', 'DF', 6),
  ('002305M03', 'cabinda', 'FRANCISCO DOMINGAS CHICAPA', 'FRANCISCO DOMINGAS CHICAPA', null, '002305M03', '1LK64T5', 'MALE', '2003-08-06', 'Angola', 'GK', 12),
  ('001084M93', 'cabinda', 'Costa Miguel Domingos Titi', 'Costa Miguel Domingos Titi', null, '001084M93', '1K2Q5N7', 'MALE', '1993-07-03', 'Angola', 'FWD', 7),
  ('002935M04', 'cabinda', 'Marcos Lando', 'Marcos Lando', null, '002935M04', '1MBGNX6', 'MALE', '2004-02-05', 'Angola', 'DF', 5),
  ('000885M97', 'cabinda', 'Cristiano Malonda', 'Cristiano Malonda', null, '000885M97', '1K1JPC1', 'MALE', '1997-12-05', 'Angola', 'MF', 8),
  ('002301M94', 'cabinda', 'JAIME DA GRACA MALONDA BUANGE', 'JAIME DA GRACA MALONDA BUANGE', null, '002301M94', '1LK64M0', 'MALE', '1994-03-03', 'Angola', 'MF', 26),
  ('003021M00', 'cabinda', 'Gedeon Macosso Mananga', 'Gedeon Macosso Mananga', null, '003021M00', '1MKPPY5', 'MALE', '2000-04-05', 'Angola', 'FWD', 3),
  ('000896M02', 'cabinda', 'Júlio Mavungo André', 'Júlio Mavungo André', null, '000896M02', '1K1K9H8', 'MALE', '2002-06-17', 'Angola', 'DF', 17),
  ('003077M00', 'cabinda', 'António Makiobo Mbungo', 'António Makiobo Mbungo', null, '003077M00', '1MQUWG3', 'MALE', '2000-06-06', 'Angola', 'DF', 16),
  ('000328M97', 'cabinda', 'FREDERICO ZAU', 'FREDERICO ZAU', null, '000328M97', '1JM8ES9', 'MALE', '1997-02-21', 'Angola', 'DF', 20),
  ('000906M95', 'cabinda', 'Rodrigo dos Santos Ngimbi', 'Rodrigo dos Santos Ngimbi', null, '000906M95', '1K1L9F6', 'MALE', '1995-01-25', 'Angola', 'DF', 2),
  ('005543M04', 'cabinda', 'ARSENIO MUANDA', 'ARSENIO MUANDA', null, '005543M04', '1QF3QJ8', 'MALE', '2004-02-03', 'Angola', 'GK', 31),
  ('000903M93', 'cabinda', 'Jose Pitra Ieze Manteiga', 'Jose Pitra Ieze Manteiga', null, '000903M93', '1K1KPX7', 'MALE', '1993-11-08', 'Angola', 'FWD', 18),
  ('007610M98', 'cabinda', 'JOSÉ ESPANHOL CARDOSO BRÁS', 'JOSÉ ESPANHOL CARDOSO BRÁS', null, '007610M98', '1TCTJI1', 'MALE', '1998-08-27', 'Angola', 'MF', 23),
  ('004713M06', 'cabinda', 'Luís Liberal Lemos Casimiro Casimiro', 'Luís Liberal Lemos Casimiro Casimiro', null, '004713M06', '1PNMR23', 'MALE', '2006-10-27', 'Angola', 'DF', 27),
  ('003348M92', 'cabinda', 'João Cambo', 'João Cambo', null, '003348M92', '1N84LF1', 'MALE', '1992-12-21', 'Angola', 'DF', 25),
  ('007814M07', 'cabinda', 'Rodilson sumbo Da Costa', 'Rodilson sumbo Da Costa', null, '007814M07', '1THXAC4', 'MALE', '2007-10-12', 'Angola', 'MF', 10),
  ('005642M05', 'cabinda', 'Pedro da Silva Da Silva', 'Pedro da Silva Da Silva', null, '005642M05', '1QFQTT4', 'MALE', '2005-07-09', 'Angola', 'FWD', 30),
  ('000658M00', 'cabinda', 'JOÃO EDUARDO', 'JOÃO EDUARDO', null, '000658M00', '1JZI8E0', 'MALE', '2000-07-17', 'Angola', 'GK', 1),
  ('005777M05', 'cabinda', 'Simão Gomes', 'Simão Gomes', null, '005777M05', '1QHWAA4', 'MALE', '2005-07-19', 'Angola', 'FWD', 14),
  ('002243M00', 'cabinda', 'António Kapata', 'António Kapata', null, '002243M00', '1LJWC86', 'MALE', '2000-09-07', 'Angola', 'FWD', 9),
  ('006043M00', 'cabinda', 'Francisco Luemba', 'Francisco Luemba', null, '006043M00', '1QTZY92', 'MALE', '2000-02-15', 'Angola', 'DF', 4),
  ('002177M01', 'cabinda', 'Mário Chiwale Caluaco da Silva Mário', 'Mário Chiwale Caluaco da Silva Mário', null, '002177M01', '1LJJYH4', 'MALE', '2001-04-11', 'Angola', 'MF', 24),
  ('002858M06', 'cabinda', 'DOMINGOS PAIXÃO PAULINO LOURENÇO', 'DOMINGOS PAIXÃO PAULINO LOURENÇO', null, '002858M06', '1MA5QN6', 'MALE', '2006-11-11', 'Angola', 'MF', 19),
  ('002228M92', 'cabinda', 'LUYEYE TOMÁS TOMÁS', 'LUYEYE TOMÁS TOMÁS', null, '002228M92', '1LJVYM8', 'MALE', '1992-02-12', 'Angola', 'MF', 13)
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  birth_date = excluded.birth_date, nationality = excluded.nationality, position = excluded.position,
  jersey_number = excluded.jersey_number, updated_at = timezone('utc', now());

-- Estrela 1.º de Maio — 14 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('003006M82', 'primeiromaio', 'Igor Joaquim Da Cotsa Cordeiro', 'Igor Joaquim Da Cotsa Cordeiro', null, '003006M82', '1MK97N8', null, 'PHYS', 'Angola'),
  ('007272M96', 'primeiromaio', 'Ludivaldo Fonseca Lutukuta', 'Ludivaldo Fonseca Lutukuta', null, '007272M96', '1SR6E42', null, 'TSTF', 'Angola'),
  ('006249M87', 'primeiromaio', 'António Manuel Dos Santos TS', 'António Manuel Dos Santos TS', null, '006249M87', '1QWA4G9', null, 'TSTF', 'Angola'),
  ('003515M75', 'primeiromaio', 'FRANCISCO SACHINGOMBE CASIMIRO CASSOMA', 'FRANCISCO SACHINGOMBE CASIMIRO CASSOMA', null, '003515M75', '1NC2UJ5', null, 'TMED', 'Angola'),
  ('001820M86', 'primeiromaio', 'FERNANDO FITA ANTÓNIO FRANCISCO', 'FERNANDO FITA ANTÓNIO FRANCISCO', null, '001820M86', '1LDITX7', null, 'TSTF', 'Angola'),
  ('003513M56', 'primeiromaio', 'FUSO NKOSI', 'FUSO NKOSI', null, '003513M56', '1NC2UD8', null, 'TCSC', 'Angola'),
  ('001229M84', 'primeiromaio', 'José Nguli Nahenda', 'José Nguli Nahenda', null, '001229M84', '1KZG174', null, 'GKCH', 'Angola'),
  ('003846M63', 'primeiromaio', 'MANUEL SILVA', 'MANUEL SILVA', null, '003846M63', '1NWV3Z3', null, 'KMGR', 'Angola'),
  ('003010M86', 'primeiromaio', 'Adirio Francisco Simoes', 'Adirio Francisco Simoes', null, '003010M86', '1MK9CA3', null, 'PTNR', 'Angola'),
  ('000796M73', 'primeiromaio', 'Águas Da Silva', 'Águas Da Silva', null, '000796M73', '1K0SAP5', null, 'HDCH', 'Angola'),
  ('000497M85', 'primeiromaio', 'JOÃO FORTUNA', 'JOÃO FORTUNA', null, '000497M85', '1JULVL6', null, 'AMGR', 'Angola'),
  ('005770M75', 'primeiromaio', 'WILSON QUIZANGA ESTEVES', 'WILSON QUIZANGA ESTEVES', null, '005770M75', '1QHT4H3', null, 'TMGR', 'Angola'),
  ('009006M83', 'primeiromaio', 'Hermino Nunes', 'Hermino Nunes', null, '009006M83', '1V1TKH6', null, null, 'Angola'),
  ('002185M83', 'primeiromaio', 'Zamba Victor', 'Zamba Victor', null, '002185M83', '1LJU067', null, 'GKCH', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Wiliete de Benguela — 20 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('000546M85', 'wiliete', 'DILSON MACUVA ALFREDO', 'DILSON MACUVA ALFREDO', null, '000546M85', '1JWUI26', null, null, 'Angola'),
  ('003004M94', 'wiliete', 'Antonio Victorino Baptista', 'Antonio Victorino Baptista', null, '003004M94', '1MK97B6', null, null, 'Angola'),
  ('000549M52', 'wiliete', 'ANTONIO BENTO', 'ANTONIO BENTO', null, '000549M52', '1JWUIF1', null, 'TMED', 'Angola'),
  ('000555M86', 'wiliete', 'ABEL CASSINDA', 'ABEL CASSINDA', null, '000555M86', '1JWUJX1', null, 'KMGR', 'Angola'),
  ('000556M85', 'wiliete', 'WILSON FERNANDO FARIA', 'WILSON FERNANDO FARIA', null, '000556M85', '1JWUJZ5', null, null, 'Angola'),
  ('003005M03', 'wiliete', 'Evaristo Gomes', 'Evaristo Gomes', null, '003005M03', '1MK97J1', null, null, 'Angola'),
  ('000535M89', 'wiliete', 'FELICIANO FELISBERTO JAVELA', 'FELICIANO FELISBERTO JAVELA', null, '000535M89', '1JWTP61', null, 'TMGR', 'Angola'),
  ('007514M86', 'wiliete', 'Promise Mandidzidze', 'Promise Mandidzidze', null, '007514M86', '1T8TKA5', null, 'TMGR', 'Zimbabwe'),
  ('007258M80', 'wiliete', 'Issac bambi Moandjambi', 'Issac bambi Moandjambi', null, '007258M80', '1SQ9Y45', null, 'PHYS', 'Angola'),
  ('002979M67', 'wiliete', 'Francisco Junior Paulino', 'Francisco Junior Paulino', null, '002979M67', '1MHN3M9', null, null, 'Angola'),
  ('008405M66', 'wiliete', 'Roberto Luiz Pelliser Bianchi', 'Roberto Luiz Pelliser Bianchi', null, '008405M66', null, null, null, 'Spain'),
  ('000553M83', 'wiliete', 'BAPTISTA SABALO', 'BAPTISTA SABALO', null, '000553M83', '1JWUJI1', null, 'KMGR', 'Angola'),
  ('008201M99', 'wiliete', 'Maurício Adriano Sapalo', 'Maurício Adriano Sapalo', null, '008201M99', '1UR28E3', null, 'TMGR', 'Angola'),
  ('008203M73', 'wiliete', 'Pedro Fernando Sapi', 'Pedro Fernando Sapi', null, '008203M73', '1UR29B0', null, 'TMGR', 'Angola'),
  ('000550M65', 'wiliete', 'AGOSTINHO SOMA', 'AGOSTINHO SOMA', null, '000550M65', '1JWUII0', null, 'PHYS', 'Angola'),
  ('000547M84', 'wiliete', 'VICTORINO LUNGA VISELE', 'VICTORINO LUNGA VISELE', null, '000547M84', '1JWUI52', null, null, 'Angola'),
  ('000548M89', 'wiliete', 'CLAUDIO GRACIANO EZEQUIEL ZALA', 'CLAUDIO GRACIANO EZEQUIEL ZALA', null, '000548M89', '1JWUI94', null, null, 'Angola'),
  ('007257M86', 'wiliete', 'Artur Jaime Vilinga', 'Artur Jaime Vilinga', null, '007257M86', '1SQ9Y00', null, 'TMGR', 'Angola'),
  ('000514M74', 'wiliete', 'JOAQUIM JOSE PEDRO', 'JOAQUIM JOSE PEDRO', null, '000514M74', '1JV1CG5', null, 'GKCH', 'Angola'),
  ('003009M63', 'wiliete', 'Jorge Manuel Faial Delgado', 'Jorge Manuel Faial Delgado', null, '003009M63', '1MK9BR4', null, null, 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Desportivo da Huíla — 14 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('000831M67', 'desphuila', 'Jojo', 'João António', 'Jojo', '000831M67', '1K15PL1', null, 'PHYS', 'Angola'),
  ('000858M63', 'desphuila', 'Luis Borge', 'José Borges', 'Luis Borge', '000858M63', '1K1EWX7', null, 'PTNR', 'Angola'),
  ('000850M86', 'desphuila', 'Alfredo Calunganga', 'Alfredo Calunganga', null, '000850M86', '1K177K5', null, null, 'Angola'),
  ('000847M87', 'desphuila', 'Sidney', 'Sidney Candeias', 'Sidney', '000847M87', '1K17646', null, null, 'Angola'),
  ('003172M87', 'desphuila', 'Luis', 'Luis Tchilamba Daniel', 'Luis', '003172M87', '1MVM2R1', null, 'TCSC', 'Angola'),
  ('000828M64', 'desphuila', 'Ezequias', 'Ezequias Domingos', 'Ezequias', '000828M64', '1K15KV6', null, null, 'Angola'),
  ('002968M71', 'desphuila', 'Zela Barroso Emanuel', 'Zela Barroso Emanuel', null, '002968M71', '1ME3PE8', null, null, 'Angola'),
  ('004750M84', 'desphuila', 'Neto', 'Joao Capitao Gomes', 'Neto', '004750M84', '1PNMUF7', null, 'TMED', 'Angola'),
  ('007731M98', 'desphuila', 'Victor Tembo Memo', 'Victor Tembo Memo', null, '007731M98', '1TFVGY8', null, 'DOCT', 'Angola'),
  ('000500M67', 'desphuila', 'Man-moi', 'Avelino Moises', 'Man-moi', '000500M67', '1JUMIC4', null, 'KMGR', 'Angola'),
  ('000832M66', 'desphuila', 'Santos', 'David Santos', 'Santos', '000832M66', '1K15PX7', null, 'TMED', 'Angola'),
  ('000826M79', 'desphuila', 'Luis Sipilante', 'Luis Sipilante', null, '000826M79', '1K15JH1', null, 'TMED', 'Angola'),
  ('000829M69', 'desphuila', 'Bebe', 'António Tchimbungo', 'Bebe', '000829M69', '1K15NN8', null, 'TMGR', 'Angola'),
  ('000857M71', 'desphuila', 'Paulo Torres', 'Paulo Torres', 'Paulo Torres', '000857M71', '1K1ETK8', null, 'HDCH', 'Portugal')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- CD 1.º de Agosto — 15 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('000965M83', 'dago', 'Antônio Filipe de Almeida', 'Antônio Filipe de Almeida', null, '000965M83', '1K1V696', null, 'PHYS', 'Angola'),
  ('000968M92', 'dago', 'Gelson Inácio Mendes Antonio', 'Gelson Inácio Mendes Antonio', null, '000968M92', '1K1VB66', null, 'PHYS', 'Angola'),
  ('007335M63', 'dago', 'Mario de Sousa Calado', 'Mario de Sousa Calado', null, '007335M63', '1T0DJE3', null, 'TMGR', 'Angola'),
  ('000444M62', 'dago', 'Virgilio Paez Fernandez', 'Virgilio Paez Fernandez', null, '000444M62', '1JSJ6H8', null, 'DOCT', 'Cuba'),
  ('000966M83', 'dago', 'Alejandro Janes Gutierrez', 'Alejandro Janes Gutierrez', null, '000966M83', '1K1VAT2', null, 'PHYS', 'Cuba'),
  ('002965M79', 'dago', 'Edgar Jeronimo', 'Edgar Jeronimo', null, '002965M79', '1MDZQU6', null, 'AMGR', 'Angola'),
  ('000967M61', 'dago', 'Feliciano Antonio Madalena', 'Feliciano Antonio Madalena', null, '000967M61', '1K1VB02', null, 'PHYS', 'Angola'),
  ('000443M69', 'dago', 'Jose Manuel Marcelino', 'Jose Manuel Marcelino', null, '000443M69', '1JSJ6F5', null, 'TMGR', 'Angola'),
  ('006498F69', 'dago', 'Andrade Jose Mendes', 'Andrade Jose Mendes', null, '006498F69', '1S8UKT1', 'FEMALE', 'PHYS', 'Angola'),
  ('000439M69', 'dago', 'Filipe Nzanza', 'Filipe Nzanza', null, '000439M69', '1JSFXH8', null, 'HDCH', 'Angola'),
  ('003234M87', 'dago', 'António Francisco Alves Pinto PREPARADOR FÍSICO', 'António Francisco Alves Pinto PREPARADOR FÍSICO', null, '003234M87', '1MZIDU5', null, 'PTNR', 'Angola'),
  ('003387M82', 'dago', 'Mario Jorge da Silva Queiroz', 'Mario Jorge da Silva Queiroz', null, '003387M82', '1N8QUB6', null, 'TMGR', 'Angola'),
  ('003031M77', 'dago', 'Untonesa Avelino Sampaio', 'Untonesa Avelino Sampaio', null, '003031M77', '1MMQHJ4', null, 'TMGR', 'Angola'),
  ('000374M61', 'dago', 'Ivo Raimundo Traça', 'Ivo Raimundo Traça', null, '000374M61', '1JRLEF7', null, 'ASCH', 'Angola'),
  ('007220M64', 'dago', 'Thomas Napoleão Cersar', 'Thomas Napoleão Cersar', null, '007220M64', '1SL00E1', null, 'GKCH', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Kabuscorp SC — 16 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('001838M73', 'kabuscorp', 'JORGE DE ALMEIDA', 'JORGE DE ALMEIDA', null, '001838M73', '1LGPM02', null, 'TMED', 'Angola'),
  ('001846M94', 'kabuscorp', 'MANUEL FRANCISCO ANDRÉ', 'MANUEL FRANCISCO ANDRÉ', null, '001846M94', '1LGSZS7', null, 'KMGR', 'Angola'),
  ('002978M69', 'kabuscorp', 'Roberto Cambundo', 'Roberto Cambundo', null, '002978M69', '1MHJ760', null, 'TMGR', 'Angola'),
  ('005444M86', 'kabuscorp', 'Olavo Patricio De Almeida Miguel', 'Olavo Patricio De Almeida Miguel', null, '005444M86', '1PZDSY4', null, 'TMED', 'Angola'),
  ('001837M63', 'kabuscorp', 'JOSÉ DOMINGOS', 'JOSÉ DOMINGOS', null, '001837M63', '1LGPLZ3', null, null, 'Angola'),
  ('000948M90', 'kabuscorp', 'FILIPE DUCUL0', 'FILIPE DUCUL0', null, '000948M90', '1K1SMR9', null, 'TCSC', 'Angola'),
  ('008244M84', 'kabuscorp', 'MARCELO VITOR FROEDER CHRISPINIANO', 'MARCELO VITOR FROEDER CHRISPINIANO', null, '008244M84', null, null, 'PTNR', 'Angola'),
  ('003033M67', 'kabuscorp', 'Raul Mendonça Gaspar', 'Raul Mendonça Gaspar', null, '003033M67', '1MMQI51', null, 'TSTF', 'Angola'),
  ('007965M73', 'kabuscorp', 'ADRIANO LANCETTA', 'ADRIANO LANCETTA', null, '007965M73', '1TYZR92', null, 'PTNR', 'Brazil'),
  ('007732M86', 'kabuscorp', 'DANIEL MABATA', 'DANIEL MABATA', null, '007732M86', '1TFVSW6', null, 'TSTF', 'Angola'),
  ('003110M81', 'kabuscorp', 'Salomão Pedro Manuel', 'Salomão Pedro Manuel', null, '003110M81', '1MS2G50', null, 'PHYS', 'Angola'),
  ('001845M82', 'kabuscorp', 'INÁCIO SANDUNDU MANUEL', 'INÁCIO SANDUNDU MANUEL', null, '001845M82', '1LGSZQ3', null, 'KMGR', 'Angola'),
  ('007949M77', 'kabuscorp', 'LEONARDO MARTINS NEIVA', 'LEONARDO MARTINS NEIVA', null, '007949M77', null, null, 'HDCH', 'Brazil'),
  ('008260M81', 'kabuscorp', 'MARCELO MUNIZ MATOS', 'MARCELO MUNIZ MATOS', null, '008260M81', '1URSHN9', null, 'GKCH', 'Brazil'),
  ('001839M65', 'kabuscorp', 'PEDRO DE OLIVEIRA', 'PEDRO DE OLIVEIRA', null, '001839M65', '1LGPM15', null, 'MASG', 'Angola'),
  ('001836M65', 'kabuscorp', 'BENTO DOS SANTOS', 'BENTO DOS SANTOS', null, '001836M65', '1LGPLY5', null, 'TSTF', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Académica do Lobito — 16 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('000599M82', 'lobito', 'DOMINGOS LUVULI ABEL', 'DOMINGOS LUVULI ABEL', null, '000599M82', '1JXIFY5', null, 'KMGR', 'Angola'),
  ('000569M72', 'lobito', 'ANTÓNIO DAVID ALMEIDA', 'ANTÓNIO DAVID ALMEIDA', null, '000569M72', '1JXIBE6', null, null, 'Angola'),
  ('008956M88', 'lobito', 'EDSON CHIPUNGA ZEFERINO ANDRÉ', 'EDSON CHIPUNGA ZEFERINO ANDRÉ', null, '008956M88', '1V0Q513', null, null, 'Angola'),
  ('000571M69', 'lobito', 'LUIS GONÇALO BARROS LOPES BORGES', 'LUIS GONÇALO BARROS LOPES BORGES', null, '000571M69', '1JXIBT3', null, 'Presidente', 'Angola'),
  ('000626M84', 'lobito', 'FELIX SANGUEVE CALUEIO', 'FELIX SANGUEVE CALUEIO', null, '000626M84', '1JXWVW8', null, null, 'Angola'),
  ('008957M86', 'lobito', 'DAVID KACHIMONGA FARIA CIGARRO', 'DAVID KACHIMONGA FARIA CIGARRO', null, '008957M86', '1V0Q5M9', null, 'KMGR', 'Angola'),
  ('005518M03', 'lobito', 'ANTONIO CATUMBELA EURICO(MIRITO)', 'ANTONIO CATUMBELA EURICO(MIRITO)', null, '005518M03', '1Q4II41', null, 'TMED', 'Angola'),
  ('002013M64', 'lobito', 'FERNANDO LUCIANO HOSSI', 'FERNANDO LUCIANO HOSSI', null, '002013M64', '1LIMNW4', null, null, 'Angola'),
  ('000510M65', 'lobito', 'JOSE SILVESTRE PEREIRA JORGE', 'JOSE SILVESTRE PEREIRA JORGE', null, '000510M65', '1JUVES6', null, 'HDCH', 'Angola'),
  ('000636M79', 'lobito', 'ELISEU PEÇA LUÍS MARTINS', 'ELISEU PEÇA LUÍS MARTINS', null, '000636M79', '1JZ3VK0', null, null, 'Angola'),
  ('000570M84', 'lobito', 'FILIMO CÉSAR SOARES MASSINGA', 'FILIMO CÉSAR SOARES MASSINGA', null, '000570M84', '1JXIBL8', null, 'TMGR', 'Angola'),
  ('000597M66', 'lobito', 'VICTOR MANUEL POCOTO', 'VICTOR MANUEL POCOTO', null, '000597M66', '1JXIFL0', null, 'TMED', 'Angola'),
  ('000506M85', 'lobito', 'CARLOS EDUARDO KATANGUA SAMBACA', 'CARLOS EDUARDO KATANGUA SAMBACA', null, '000506M85', '1JUQ5X0', null, 'GKCH', 'Angola'),
  ('003057M95', 'lobito', 'Felicio Campo Serrote', 'Felicio Campo Serrote', null, '003057M95', '1MPPVQ7', null, 'ASCH', 'Angola'),
  ('000600M70', 'lobito', 'GABRIEL VISSOKA', 'GABRIEL VISSOKA', null, '000600M70', '1JXIGC7', null, 'TMED', 'Angola'),
  ('002004M68', 'lobito', 'CARLOS JOSÉ PAULINO', 'CARLOS JOSÉ PAULINO', null, '002004M68', '1LIME48', null, null, 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- FC Luanda — 7 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('007496M57', 'fcluanda', 'PAULINO ROQUE MOREIRA DA SILVA', 'PAULINO ROQUE MOREIRA DA SILVA', null, '007496M57', '1T6LMC2', null, 'TMGR', 'Angola'),
  ('006322M75', 'fcluanda', 'Matoso Manuel Fernandes da Cruz', 'Matoso Manuel Fernandes da Cruz', null, '006322M75', '1R4RDQ4', null, 'GKCH', 'Angola'),
  ('008953M90', 'fcluanda', 'SEBASTIÃO PALAVRA NGOLA NGOLA', 'SEBASTIÃO PALAVRA NGOLA NGOLA', null, '008953M90', '1V0NQA3', null, 'PTNR', 'Angola'),
  ('007495M80', 'fcluanda', 'ADRIANO MANUEL PEDRO', 'ADRIANO MANUEL PEDRO', null, '007495M80', '1T6LM80', null, 'TCSC', 'Angola'),
  ('008007F02', 'fcluanda', 'LOURDES NGUEVE XAVIER SICATO', 'LOURDES NGUEVE XAVIER SICATO', null, '008007F02', '1U4A8U9', 'FEMALE', 'PHYS', 'Angola'),
  ('007763M89', 'fcluanda', 'ALBINO MANUEL MUSSONGO DA SILVA', 'ALBINO MANUEL MUSSONGO DA SILVA', null, '007763M89', '1TGV557', null, 'TCSC', 'Angola'),
  ('009028M86', 'fcluanda', 'SHAI YESHAYA PERETZ PERETZ', 'SHAI YESHAYA PERETZ PERETZ', null, '009028M86', '1V29MH7', null, 'TMGR', 'Israel')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Recreativo do Libolo — 11 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('007635M89', 'libolo', 'André Agostinho', 'André Agostinho', null, '007635M89', '1TDB1V6', null, 'AMGR', 'Angola'),
  ('001173M70', 'libolo', 'OSVALDO ROQUE GONÇALVES DA CRUZ', 'OSVALDO ROQUE GONÇALVES DA CRUZ', null, '001173M70', '1KD5T18', null, 'HDCH', 'Angola'),
  ('000684M84', 'libolo', 'RAUL DE ALMEIDA', 'RAUL DE ALMEIDA', null, '000684M84', '1JZJVA2', null, 'TMGR', 'Angola'),
  ('007687M93', 'libolo', 'Francisco Miguel Fortunato Direito', 'Francisco Miguel Fortunato Direito', null, '007687M93', '1TE6C99', null, 'PTNR', 'Angola'),
  ('008941M98', 'libolo', 'FRANCISCO FERNANDO FERREIRA MIÚDO', 'FRANCISCO FERNANDO FERREIRA MIÚDO', null, '008941M98', '1UZZT01', null, 'MASG', 'Angola'),
  ('000685M70', 'libolo', 'TADEU MOREIRA', 'TADEU MOREIRA', null, '000685M70', '1JZJWR4', null, 'MASG', 'Angola'),
  ('007636M94', 'libolo', 'JAIME PEREIRA', 'JAIME PEREIRA', null, '007636M94', '1TDB1X2', null, 'TMGR', 'Angola'),
  ('007637M85', 'libolo', 'JOÃO PEREIRA', 'JOÃO PEREIRA', null, '007637M85', '1TDB238', null, 'TMGR', 'Angola'),
  ('001347M91', 'libolo', 'DOMINGOS PEDRO SEBASTIÃO', 'DOMINGOS PEDRO SEBASTIÃO', null, '001347M91', '1L09QH0', null, 'GKCH', 'Angola'),
  ('007252M91', 'libolo', 'MIGUEL VASCO DOMINGOS FÉLIX', 'MIGUEL VASCO DOMINGOS FÉLIX', null, '007252M91', '1SQ8VM9', null, 'TSTF', 'Angola'),
  ('005852M85', 'libolo', 'Sebastião Oliveira Velez', 'Sebastião Oliveira Velez', null, '005852M85', '1QK3JJ3', null, 'ASCH', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- CR Caála — 12 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('006320M83', 'caala', 'SABINO COLINO RAMIRES ADÃO', 'SABINO COLINO RAMIRES ADÃO', null, '006320M83', '1R4EWU2', null, 'DOCT', 'Angola'),
  ('005496M80', 'caala', 'SEVERINO ULOMBE CAPESSA', 'SEVERINO ULOMBE CAPESSA', null, '005496M80', '1Q1PQC7', null, 'GKCH', 'Angola'),
  ('005495M80', 'caala', 'Artur benjamim CORREIA', 'Artur benjamim CORREIA', null, '005495M80', '1Q1PPA5', null, 'HDCH', 'Angola'),
  ('007488M92', 'caala', 'Herminio Afonso Teixeira Correia', 'Herminio Afonso Teixeira Correia', null, '007488M92', '1T6LHY1', null, 'TMGR', 'Angola'),
  ('005653M87', 'caala', 'LEONEL LOPES DA CRUZ', 'LEONEL LOPES DA CRUZ', null, '005653M87', '1QFXQE9', null, 'TCSC', 'Angola'),
  ('006178M65', 'caala', 'MANUEL CIRILO DA CRUZ', 'MANUEL CIRILO DA CRUZ', null, '006178M65', '1QVFNX8', null, 'PTNR', 'Angola'),
  ('005651M84', 'caala', 'GABRIEL PACHECO DE SOUSA', 'GABRIEL PACHECO DE SOUSA', null, '005651M84', '1QFXQ59', null, 'TMGR', 'Angola'),
  ('003235M84', 'caala', 'EDUARDO DA CRUZ LEITE (DUDÚ)', 'EDUARDO DA CRUZ LEITE (DUDÚ)', null, '003235M84', '1MZJI23', null, 'TSTF', 'Angola'),
  ('005652M73', 'caala', 'HORÁCIO MANUEL DA SILVA MOSQUITO', 'HORÁCIO MANUEL DA SILVA MOSQUITO', null, '005652M73', '1QFXQ92', null, 'TMGR', 'Angola'),
  ('008906M97', 'caala', 'JOÃO FELIX MPUTO', 'JOÃO FELIX MPUTO', null, '008906M97', '1UY8E58', null, 'TSTF', 'Angola'),
  ('006321M84', 'caala', 'EDGAR FLORINDO MUHONGO', 'EDGAR FLORINDO MUHONGO', null, '006321M84', '1R4EWW8', null, 'PHYS', 'Angola'),
  ('003017M81', 'caala', 'José Pascoal Vidal', 'José Pascoal Vidal', null, '003017M81', '1MKPDI4', null, 'GKCH', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- GD Interclube — 15 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('007362M74', 'interclube', 'AGOSTINHO GONGA AUGUSTO ALMEIDA', 'AGOSTINHO GONGA AUGUSTO ALMEIDA', null, '007362M74', '1T3AX95', null, 'KMGR', 'Angola'),
  ('008876M78', 'interclube', 'DIVALDO DA SILVA TEIXEIRA ALVES', 'DIVALDO DA SILVA TEIXEIRA ALVES', null, '008876M78', null, null, 'HDCH', 'Angola'),
  ('003249M68', 'interclube', 'MANUEL ABÍLIO ANTÓNIO', 'MANUEL ABÍLIO ANTÓNIO', null, '003249M68', '1N2K1R9', null, 'TMGR', 'Angola'),
  ('000471M61', 'interclube', 'JOSÉ CANELAS', 'JOSÉ CANELAS', null, '000471M61', '1JTK1B1', null, 'TMGR', 'Angola'),
  ('000337M85', 'interclube', 'HELDER DINIS', 'HELDER DINIS', null, '000337M85', '1JNWB15', null, 'PTNR', 'Angola'),
  ('008911M00', 'interclube', 'CLENIO ANTÓNIO DE ALMEIDA REIS FANÇONY', 'CLENIO ANTÓNIO DE ALMEIDA REIS FANÇONY', null, '008911M00', '1UYJSJ6', null, 'PHYS', 'Angola'),
  ('008862M70', 'interclube', 'João Claudio de Almeida Gomes', 'João Claudio de Almeida Gomes', null, '008862M70', '1UWPA91', null, 'AMGR', 'Angola'),
  ('000473M68', 'interclube', 'JOÃO ISALINO', 'JOÃO ISALINO', null, '000473M68', '1JTK218', null, 'TMGR', 'Angola'),
  ('000501M74', 'interclube', 'Lourenco Jesus', 'Lourenco Jesus', null, '000501M74', '1JUMQ52', null, 'GKCH', 'Angola'),
  ('000470M73', 'interclube', 'MANUEL JÚNIOR', 'MANUEL JÚNIOR', null, '000470M73', '1JTK146', null, 'TMGR', 'Angola'),
  ('000469M92', 'interclube', 'EDSON KAMBUNGO', 'EDSON KAMBUNGO', null, '000469M92', '1JTK109', null, 'TCSC', 'Angola'),
  ('000472M72', 'interclube', 'AUGUSTO MANUEL', 'AUGUSTO MANUEL', null, '000472M72', '1JTK1R3', null, 'TMED', 'Angola'),
  ('001703M91', 'interclube', 'Zeferino Nambi', 'Zeferino Nambi', null, '001703M91', '1LCMLP4', null, 'ASCH', 'Angola'),
  ('000332M66', 'interclube', 'JOSÉ PEREIRA', 'JOSÉ PEREIRA', null, '000332M66', '1JMFY65', null, 'PHYS', 'Angola'),
  ('005872M69', 'interclube', 'HENRIQUES NEVES RIBEIRO SOBRINHO', 'HENRIQUES NEVES RIBEIRO SOBRINHO', null, '005872M69', '1QKR5L0', null, 'ASCH', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Bravos do Maquis — 13 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('001147M77', 'bravos', 'Ogito Gourgel Alberto', 'Ogito Gourgel Alberto', null, '001147M77', '1K4QQQ0', 'MALE', 'DOCT', 'Angola'),
  ('003018M81', 'bravos', 'Belo Chanhi', 'Benvindo Camuabo', 'Belo Chanhi', '003018M81', '1MKPEA7', 'MALE', null, 'Angola'),
  ('000551M75', 'bravos', 'FERNANDO AFONSO CAETANO', 'FERNANDO AFONSO CAETANO', null, '000551M75', '1JWUIN9', 'MALE', 'TMED', 'Angola'),
  ('000702M85', 'bravos', 'Ilunga', 'Nelson Milione', 'Ilunga', '000702M85', '1JZZF63', 'MALE', null, 'Angola'),
  ('000713M87', 'bravos', 'Jongolo', 'José Tchinhama', 'Jongolo', '000713M87', '1JZZIP6', 'MALE', 'KMGR', 'Angola'),
  ('005407M81', 'bravos', 'Mariano Júlio', 'Mariano Júlio', null, '005407M81', '1PWDL71', 'MALE', 'ASCH', 'Angola'),
  ('000701M82', 'bravos', 'Lobo', 'Almiro Edson Daniel', 'Lobo', '000701M82', '1JZZDW2', 'MALE', 'ASCH', 'Mozambique'),
  ('001060M89', 'bravos', 'Lourenço Nelito', 'Lourenço Nelito', null, '001060M89', '1K2P3A1', 'MALE', 'HDCH', 'Angola'),
  ('000706M71', 'bravos', 'Pedro Neto', 'Pedro Neto', null, '000706M71', '1JZZG71', 'MALE', 'GKCH', 'Angola'),
  ('000710M75', 'bravos', 'Samba', 'Sebastiao Almeida', 'Samba', '000710M75', '1JZZH62', 'MALE', null, 'Angola'),
  ('000703M73', 'bravos', 'Simao', 'Garcia Nunes Zalacanda', 'Simao', '000703M73', '1JZZF82', 'MALE', 'KMGR', 'Angola'),
  ('000712M79', 'bravos', 'Tchinguli', 'Rotano Antonio', 'Tchinguli', '000712M79', '1JZZHQ4', 'MALE', 'DOCT', 'Angola'),
  ('005392M68', 'bravos', 'Tomás', 'José Paulo', 'Tomás', '005392M68', '1PVXMS7', 'MALE', null, 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Sagrada Esperança — 16 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('000757M72', 'sagrada', 'ESTEVES', 'TEMISTÓCLES ALFREDO', 'ESTEVES', '000757M72', '1K0EGU3', 'MALE', 'DOCT', 'Angola'),
  ('000975M63', 'sagrada', 'BERNARDO', 'SEBASTIÃO FRANCISCO', 'BERNARDO', '000975M63', '1K1YUT0', 'MALE', 'PHYS', 'Angola'),
  ('008942M62', 'sagrada', 'CAQUEHELE', 'NEVES CURIONGA', 'CAQUEHELE', '008942M62', '1UZZUG4', 'MALE', 'KMGR', 'Angola'),
  ('004415M91', 'sagrada', 'CATEMBA', 'ADOLFO DA SILVA', 'CATEMBA', '004415M91', '1PK4L28', 'MALE', 'ASCH', 'Angola'),
  ('007283M92', 'sagrada', 'DALA', 'NASCIMENTO ANTÓNIO', 'DALA', '007283M92', '1SR6S35', 'MALE', 'PTNR', 'Angola'),
  ('007247M76', 'sagrada', 'MENDES', 'HUMBERTO JORGE GARCIA', 'MENDES', '007247M76', '1UYMLQ8', 'MALE', 'TCSC', 'Angola'),
  ('001195M68', 'sagrada', 'HUNGO', 'FRANCISCO MONIZ', 'HUNGO', '001195M68', '1KGM6H8', 'MALE', 'HDCH', 'Angola'),
  ('004599M98', 'sagrada', 'Afonso Julio', 'Afonso Julio', null, '004599M98', '1PMNI33', 'MALE', 'TMED', 'Angola'),
  ('007282M88', 'sagrada', 'JÚLIO LUPAPA', 'GUEDES INÊS CASTRO', 'JÚLIO LUPAPA', '007282M88', '1SR6RJ5', 'MALE', 'TMGR', 'Angola'),
  ('002860M66', 'sagrada', 'JOSÉ LEONARDO', 'JOSÉ LEONARDO', null, '002860M66', '1MA5RK8', 'MALE', 'TSTF', 'Angola'),
  ('004414M99', 'sagrada', 'LUNDUNDJA', 'QUINTAS HAIO', 'LUNDUNDJA', '004414M99', '1PK4L15', 'MALE', 'GKCH', 'Angola'),
  ('000753M66', 'sagrada', 'MARCOS', 'PEDRO BORGES', 'MARCOS', '000753M66', '1K0EG76', 'MALE', 'TMGR', 'Angola'),
  ('007242M79', 'sagrada', 'MENDONÇA', 'CLEMENTE MARTINS', 'MENDONÇA', '007242M79', '1SPSQZ4', 'MALE', null, 'Angola'),
  ('006526M63', 'sagrada', 'RUI SAPIRI', 'RUI SAPIRI', null, '006526M63', '1S9I6A5', 'MALE', 'ASCH', 'Angola'),
  ('007291M70', 'sagrada', 'ANDRÉ TXIUMA', 'ANDRÉ TXIUMA', null, '007291M70', '1SSDDU3', 'MALE', 'PHYS', 'Angola'),
  ('002859M85', 'sagrada', 'ALBANO', 'EDUARDO VIEIRA', 'ALBANO', '002859M85', '1MA5R88', 'MALE', null, 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Desportivo da Lunda Sul — 20 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('007301M94', 'lundasul', 'BELÍSIO ALBERTO', 'BELÍSIO ALBERTO', null, '007301M94', '1SURZZ3', 'MALE', 'TSTF', 'Angola'),
  ('007169M84', 'lundasul', 'PEDRO BARROS', 'PEDRO BARROS', null, '007169M84', '1SDA6D5', 'MALE', 'ASCH', 'Angola'),
  ('007284F95', 'lundasul', 'ANDREZA CALONGO', 'ANDREZA CALONGO', null, '007284F95', '1SR6WB2', 'FEMALE', 'TSTF', 'Angola'),
  ('000790M83', 'lundasul', 'Eusébio Carlos', 'Eusébio Carlos', null, '000790M83', '1K0S9T7', 'MALE', 'KMGR', 'Angola'),
  ('000799M88', 'lundasul', 'Norberto Chicungo', 'Norberto Chicungo', null, '000799M88', '1K0SAW8', 'MALE', 'TCSC', 'Angola'),
  ('000797M68', 'lundasul', 'Miguel Da Silva', 'Miguel Da Silva', null, '000797M68', '1K0SAR8', 'MALE', 'TMGR', 'Angola'),
  ('007144M88', 'lundasul', 'OLIVEIRA DE NASCIMENTO', 'OLIVEIRA DE NASCIMENTO', null, '007144M88', '1SD3NI4', 'MALE', 'MASG', 'Angola'),
  ('008909M78', 'lundasul', 'Gomes Diogo', 'José Neves', 'Gomes Diogo', '008909M78', '1UYFU21', 'MALE', 'TMGR', 'Angola'),
  ('000781M60', 'lundasul', 'JOAO DOS REIS', 'JOAO DOS REIS', null, '000781M60', '1K0S8G8', 'MALE', 'AMGR', 'Angola'),
  ('001200M70', 'lundasul', 'Domingos Dos Santos', 'Domingos Dos Santos', null, '001200M70', '1KJVMB5', 'MALE', 'TMGR', 'Angola'),
  ('001199M74', 'lundasul', 'Abel Fidel', 'Abel Fidel', null, '001199M74', '1KJVM56', 'MALE', 'AMGR', 'Angola'),
  ('007143M88', 'lundasul', 'COJI JONASSE', 'COJI JONASSE', null, '007143M88', '1SD3NG8', 'MALE', 'ASCH', 'Angola'),
  ('007142M76', 'lundasul', 'VASCO KASSULE', 'VASCO KASSULE', null, '007142M76', '1SD3NF9', 'MALE', 'ASCH', 'Angola'),
  ('001202M84', 'lundasul', 'Lucas Lundola', 'Lucas Lundola', null, '001202M84', '1KLCJH7', 'MALE', 'ASCH', 'Angola'),
  ('008861M65', 'lundasul', 'Manuel', 'Inoc Neves', 'Manuel', '008861M65', '1UWNDH6', 'MALE', 'PHYS', 'Angola'),
  ('003805M90', 'lundasul', 'Vanderlei Muaximbuba', 'Vanderlei Muaximbuba', null, '003805M90', '1NWH0R3', 'MALE', 'ASCH', 'Angola'),
  ('000801M60', 'lundasul', 'ILOUA NTUMBA', 'ILOUA NTUMBA', null, '000801M60', '1K0SB50', 'MALE', 'TMED', 'Angola'),
  ('000791M75', 'lundasul', 'Rogéiro Riangue', 'Rogéiro Riangue', null, '000791M75', '1K0S9V3', 'MALE', 'ASCH', 'Angola'),
  ('007141M62', 'lundasul', 'CARLOS SACHICUATA', 'CARLOS SACHICUATA', null, '007141M62', '1SD3ND7', 'MALE', 'ASCH', 'Angola'),
  ('000800M91', 'lundasul', 'Domingos Yeno', 'Domingos Yeno', null, '000800M91', '1K0SAY9', 'MALE', 'KMGR', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- São Salvador — 14 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('002327M88', 'saosalvador', 'Joaquim Matondo Antonio', 'Joaquim Matondo Antonio', null, '002327M88', '1LLNQ91', null, 'TMGR', 'Angola'),
  ('003126M87', 'saosalvador', 'EDUARDO MENDES MARCIANO', 'EDUARDO MENDES MARCIANO', null, '003126M87', '1MTCGS0', null, 'ASCH', 'Angola'),
  ('003167M96', 'saosalvador', 'MIGUEL SANTANA MÁRIO', 'MIGUEL SANTANA MÁRIO', null, '003167M96', '1MUWT75', null, 'KMGR', 'Angola'),
  ('003162M82', 'saosalvador', 'ANDRÉ VUVU MARQUES', 'ANDRÉ VUVU MARQUES', null, '003162M82', '1MUWS30', null, 'TMGR', 'Angola'),
  ('007770M00', 'saosalvador', 'EDUARDO BAKADILA MIGUEL', 'EDUARDO BAKADILA MIGUEL', null, '007770M00', '1TGWYS1', null, 'MASG', 'Angola'),
  ('000559M96', 'saosalvador', 'MOTA SUMBO', 'MOTA SUMBO', null, '000559M96', '1JX54Z2', null, 'GKCH', 'Angola'),
  ('002326M90', 'saosalvador', 'Antonio Morgado Tulomba', 'Antonio Morgado Tulomba', null, '002326M90', '1LLNQ75', null, 'TMED', 'Angola'),
  ('003178M94', 'saosalvador', 'SALVADOR CASSAMBI COXE CARDOSO TREINADOR ADJUNTO', 'SALVADOR CASSAMBI COXE CARDOSO TREINADOR ADJUNTO', null, '003178M94', '1MW45Z4', null, 'ASCH', 'Angola'),
  ('002256M84', 'saosalvador', 'Domingos Silvano Cussanda', 'Domingos Silvano Cussanda', null, '002256M84', '1LJWGJ8', null, 'HDCH', 'Angola'),
  ('001327M98', 'saosalvador', 'CARDOSO NUNES FERREIRA FERREIRA', 'CARDOSO NUNES FERREIRA FERREIRA', null, '001327M98', '1L066K5', null, 'TCSC', 'Angola'),
  ('009030M73', 'saosalvador', 'MONIZ MANUEL', 'MONIZ MANUEL', null, '009030M73', '1V2RE26', null, 'TMGR', 'Angola'),
  ('007268F83', 'saosalvador', 'MATONDO NSAMU', 'MATONDO NSAMU', null, '007268F83', '1SQME05', 'FEMALE', 'PHYS', 'Angola'),
  ('001208M66', 'saosalvador', 'MARCOS PEDRO', 'MARCOS PEDRO', null, '001208M66', '1KYQKI6', null, 'MASG', 'Angola'),
  ('002279M84', 'saosalvador', 'MANUEL SOUSA', 'MANUEL SOUSA', null, '002279M84', '1LJYXG8', null, 'PTNR', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- Petro de Luanda — 15 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('008885M71', 'petro', 'JOÃO PEDRO RAMOS BORGES SOUSA', 'JOÃO PEDRO RAMOS BORGES SOUSA', null, '008885M71', '1UXCLE2', null, 'HDCH', 'Portugal'),
  ('008902M92', 'petro', 'EDSON DE MATOS CANDA', 'EDSON DE MATOS CANDA', null, '008902M92', '1UXQBW4', null, 'DOCT', 'Angola'),
  ('000378M87', 'petro', 'JOÃO CLÁUDIO DA COSTA E SILVA', 'JOÃO CLÁUDIO DA COSTA E SILVA', null, '000378M87', '1JRSUI1', null, 'Oficial da equipa', 'Angola'),
  ('000383M78', 'petro', 'BRUNO MIGUEL DA CRUZ VICENTE', 'BRUNO MIGUEL DA CRUZ VICENTE', null, '000383M78', '1JRT024', null, 'Diretor', 'Angola'),
  ('000373M82', 'petro', 'FELISBERTO SEBASTIÃO DA GRAÇA AMARAL', 'FELISBERTO SEBASTIÃO DA GRAÇA AMARAL', null, '000373M82', '1JRKZW5', null, 'Oficial da equipa', 'Angola'),
  ('000381M69', 'petro', 'TOMÁS FARIA', 'TOMÁS FARIA', null, '000381M69', '1JRSXE1', null, 'Presidente', 'Angola'),
  ('000379M87', 'petro', 'TIMÓTEO PAULO MARIA VEMBA', 'TIMÓTEO PAULO MARIA VEMBA', null, '000379M87', '1JRSW89', null, 'PHYS', 'Angola'),
  ('008890M81', 'petro', 'CARLOS EDUARDO MAURÍCIO PACHECO', 'CARLOS EDUARDO MAURÍCIO PACHECO', null, '008890M81', '1UXD1E3', null, 'Oficial da equipa', 'Portugal'),
  ('007233M99', 'petro', 'JOÃO ANTÓNIO MOREIRA DE SOUSA', 'JOÃO ANTÓNIO MOREIRA DE SOUSA', null, '007233M99', '1SMN3A3', null, 'PHYS', 'Angola'),
  ('003144M92', 'petro', 'ARCANJO MASSUQUINA MULANVO', 'ARCANJO MASSUQUINA MULANVO', null, '003144M92', '1MU13Q0', null, 'Oficial da equipa', 'Angola'),
  ('000339M89', 'petro', 'JOAQUIM VALINHO REIS FRAZÃO', 'JOAQUIM VALINHO REIS FRAZÃO', null, '000339M89', '1JSKUX2', null, 'ASCH', 'Portugal'),
  ('008887M87', 'petro', 'MANUEL ANTÓNIO BRAGA TERROSO SANTOS', 'MANUEL ANTÓNIO BRAGA TERROSO SANTOS', null, '008887M87', null, null, 'ASCH', 'Portugal'),
  ('008886M83', 'petro', 'RAFAEL GARCIA TONIOLI DEFENDI', 'RAFAEL GARCIA TONIOLI DEFENDI', null, '008886M83', null, null, 'GKCH', 'Portugal'),
  ('005346M99', 'petro', 'HUGO EDGAR TORRES DE MIRANDA', 'HUGO EDGAR TORRES DE MIRANDA', null, '005346M99', '1PTGWU8', null, 'PTNR', 'Portugal'),
  ('005330M94', 'petro', 'LEANDRO FILIPE VIEIRA E SILVA', 'LEANDRO FILIPE VIEIRA E SILVA', null, '005330M94', '162EQ06', null, 'Oficial da equipa', 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

-- FC Cabinda — 7 equipa técnica
insert into public.girabola_staff
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, role, nationality)
values
  ('007727M75', 'cabinda', 'Alves Simão Afonso Lede', 'Alves Simão Afonso Lede', null, '007727M75', '1TFP483', null, null, 'Angola'),
  ('007728M65', 'cabinda', 'Emanuel Mbango Nguba', 'Emanuel Mbango Nguba', null, '007728M65', '1TFP4A9', null, 'PHYS', 'Angola'),
  ('007730M63', 'cabinda', 'Albertino Pongo Sala', 'Albertino Pongo Sala', null, '007730M63', '1TFP4D8', null, 'ASCH', 'Angola'),
  ('007729M65', 'cabinda', 'Isidro José Segunda', 'Isidro José Segunda', null, '007729M65', '1TFP4C3', null, 'TMGR', 'Angola'),
  ('001088M82', 'cabinda', 'Luciano Capoco', 'Luciano Capoco', null, '001088M82', '1K2QZY0', null, null, 'Angola'),
  ('000515M75', 'cabinda', 'Zola Nseca', 'Zola Nseca', null, '000515M75', '1JV2NI3', null, null, 'Angola'),
  ('000537M93', 'cabinda', 'MONA 2', 'CIPRIANO CUMBA RAFAEL', 'MONA 2', '000537M93', '1JWTWN4', null, null, 'Angola')
on conflict (id) do update set
  club_id = excluded.club_id, name = excluded.name, full_name = excluded.full_name,
  popular_name = excluded.popular_name, fifa_id = excluded.fifa_id, gender = excluded.gender,
  role = excluded.role, nationality = excluded.nationality, updated_at = timezone('utc', now());

commit;
-- Total: 16 clubes, 514 jogadores, 225 equipa técnica.
