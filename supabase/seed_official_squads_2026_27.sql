-- Plantéis oficiais 2026/2027 (FIFA Connect / MA ID) — 16 clubes.
-- Gerado por scripts/generate-squad-sql.mjs a partir de official-squads-2026-27.ts.
-- Substitui integralmente o plantel de cada clube em public.ancaf_players.

begin;

-- Estrela 1.º de Maio (primeiromaio) — 28 jogadores
delete from public.ancaf_players where team_id = 'primeiromaio';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('primeiromaio-dimoniquene-kapembe-segunda-bongue', 'primeiromaio', 'DIMONIQUENE KAPEMBE SEGUNDA BONGUE', 'Defesa', 13, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-moises-alberto-calepi', 'primeiromaio', 'Deco', 'Avançado', 9, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-daniel-chaculemba', 'primeiromaio', 'DANIEL CHACULEMBA', 'Defesa', 28, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-muila-lengo-congolo', 'primeiromaio', 'Muila Lengo Congolo', 'Médio', 16, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-miguel-agostinho-dey', 'primeiromaio', 'Miguel Agostinho Dey', 'Defesa', 2, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-moises-mbuta-domingos', 'primeiromaio', 'MOISES MBUTA DOMINGOS', 'Defesa', 5, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-vicente-domingos', 'primeiromaio', 'VICENTE DOMINGOS', 'Médio', 34, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-fernando-mateus-duarte-duarte', 'primeiromaio', 'Fernando Mateus Duarte Duarte', 'Avançado', 20, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-luis-simoes-escovalo', 'primeiromaio', 'Luis Simoes Escovalo', 'Médio', 19, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-simao-culeca-gonga', 'primeiromaio', 'SIMÃO CULECA GONGA', 'Médio', 22, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-tadeu-numbi-da-silva-jake', 'primeiromaio', 'TADEU NUMBI DA SILVA JAKE', 'Médio', 3, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-odenir-tavares-pereira-jorge', 'primeiromaio', 'Odenir Tavares Pereira Jorge', 'Médio', 14, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-avelino-mussili-kassanhica', 'primeiromaio', 'Avelino Mussili Kassanhica', 'Avançado', 29, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-marcio-armando-goncalves-luvambo', 'primeiromaio', 'MÁRCIO ARMANDO GONÇALVES LUVAMBO', 'Defesa', 7, 40, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-rodrigues-muehombo', 'primeiromaio', 'Rodrigues Muehombo', 'Médio', 8, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-paulo-balaca-mutossi', 'primeiromaio', 'PAULO BALACA MUTOSSI', 'Defesa', 24, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-antonio-pascoal', 'primeiromaio', 'ANTÓNIO PASCOAL', 'Guarda-redes', 1, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-antonio-lucamba-pessela', 'primeiromaio', 'ANTÓNIO LUCAMBA PESSELA', 'Defesa', 26, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-antonio-lende-tchimuku', 'primeiromaio', 'ANTONIO LENDE TCHIMUKU', 'Guarda-redes', 99, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-joaquim-kanhihi-tchingombe', 'primeiromaio', 'JOAQUIM KANHIHI TCHINGOMBE', 'Guarda-redes', 56, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-francisco-ngalangui-tchitane', 'primeiromaio', 'FRANCISCO NGALANGUI TCHITANE', 'Defesa', 33, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-jose-marcos-pereira-tchivinga', 'primeiromaio', 'JOSE MARCOS PEREIRA TCHIVINGA', 'Defesa', 15, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-gelson-teles', 'primeiromaio', 'GELSON TELES', 'Médio', 18, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-eliseu-antonio-borges-varela', 'primeiromaio', 'ELISEU ANTÓNIO BORGES VARELA', 'Médio', 6, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-moises-maquico-lua', 'primeiromaio', 'Moises Maquico Lua', 'Médio', 37, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-damiao-raimundo-nicolau', 'primeiromaio', 'DAMIÃO RAIMUNDO NICOLAU', 'Defesa', 4, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-kijungu-kitumba-francisco', 'primeiromaio', 'KIJUNGU KITUMBA FRANCISCO', 'Médio', 25, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('primeiromaio-malebani-rabby', 'primeiromaio', 'MALEBANI RABBY', 'Avançado', 31, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Wiliete de Benguela (wiliete) — 32 jogadores
delete from public.ancaf_players where team_id = 'wiliete';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('wiliete-joao-valonga-basilio-barros', 'wiliete', 'JOÃO VALONGA BASILIO BARROS', 'Defesa', 26, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-augusto-manuel-balsa', 'wiliete', 'AUGUSTO MANUEL BALSA', 'Defesa', 15, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-silva-hinario-antonio', 'wiliete', 'SILVA HINÁRIO ANTÓNIO', 'Defesa', 3, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-lukman-idowu-bello', 'wiliete', 'Lukman Idowu Bello', 'Avançado', 18, 23, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-armindo-goncalves-canji', 'wiliete', 'ARMINDO GONÇALVES CANJI', 'Médio', 10, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-carlos-cassissi', 'wiliete', 'Carlos Cassissi', 'Médio', 24, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-giovani-chipopolo', 'wiliete', 'GIOVANI CHIPOPOLO', 'Defesa', 17, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-antonio-mule-chitongo', 'wiliete', 'ANTÓNIO MULE CHITONGO', 'Médio', 8, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-francisco-cubuema-matoco', 'wiliete', 'Francisco Cubuema Matoco', 'Médio', 16, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-elber-delgado', 'wiliete', 'ELBER DELGADO', 'Guarda-redes', 31, 35, 'Cabo Verde', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-filomeno-pinheiro-alberto-giloso', 'wiliete', 'FILOMENO PINHEIRO ALBERTO GILOSO', 'Avançado', 21, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-nayan-gomes', 'wiliete', 'Nayan Gomes', 'Guarda-redes', 1, 26, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-cesar-cangui-uvi-jeremias', 'wiliete', 'Cesar Cangui Uvi Jeremias', 'Avançado', 34, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-rodino-dumbo-jose', 'wiliete', 'RODINO DUMBO JOSE', 'Avançado', 25, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-emanoel-junior', 'wiliete', 'Emanoel Júnior', 'Defesa', 27, 28, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-daniel-artur-kaka', 'wiliete', 'DANIEL ARTUR KAKA', 'Médio', 19, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-antonio-manuel-victorino-kulica', 'wiliete', 'António Manuel Victorino Kulica', 'Médio', 20, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-arao-manuel-lologi', 'wiliete', 'ARÃO MANUEL LOLOGI', 'Defesa', 5, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-zeferino-venancio-lussati', 'wiliete', 'ZEFERINO VENANCIO LUSSATI', 'Avançado', 33, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-valter-manuel-monteiro', 'wiliete', 'VALTER MANUEL MONTEIRO', 'Médio', 35, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-guilherme-neto', 'wiliete', 'Guilherme Neto', 'Defesa', 4, 32, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-camilo-mbule-ngongue', 'wiliete', 'Camilo Mbule Ngongue', 'Médio', 28, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-cristovao-paciencia', 'wiliete', 'Cristovão Paciência', 'Avançado', 9, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-jorge-mendes-corte-real-carneiro', 'wiliete', 'JORGE MENDES CORTE REAL CARNEIRO', 'Médio', 7, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-teodoro-edvaldo-rita-tchissingui', 'wiliete', 'TEODORO EDVALDO RITA TCHISSINGUI', 'Guarda-redes', 12, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-bocar-sidibe', 'wiliete', 'Bocar Sidibé', 'Médio', 30, 22, 'Mali', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-adenilson-paulo-tchingando', 'wiliete', 'Adenilson Paulo Tchingando', 'Defesa', 36, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-adriano-watchilala-tchombe', 'wiliete', 'Adriano Watchilala Tchombe', 'Defesa', 13, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-deivi-miguel-vieira', 'wiliete', 'DEIVI MIGUEL VIEIRA', 'Avançado', 11, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-celio-alberto-junqueira-zua', 'wiliete', 'CELIO ALBERTO JUNQUEIRA ZUA', 'Médio', 32, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-abel-samandi-mbambi', 'wiliete', 'Abel Samandi Mbambi', 'Guarda-redes', 40, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('wiliete-eduardo-antonio-henrique-capingana', 'wiliete', 'Eduardo António Henrique capingana', 'Médio', 2, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Desportivo da Huíla (desphuila) — 28 jogadores
delete from public.ancaf_players where team_id = 'desphuila';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('desphuila-cristovao-simao', 'desphuila', 'Cristóvão Simão', 'Guarda-redes', 1, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-adilson-manuel', 'desphuila', 'Adilson Manuel', 'Defesa', 3, 37, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-antonio-dos-santos-futila-kinanga', 'desphuila', 'Dos Santos', 'Defesa', 4, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-joao-milagre-chiva-simoes', 'desphuila', 'Jo', 'Defesa', 6, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-leonardo-manuel-isola-ramos', 'desphuila', 'Cabibi', 'Avançado', 7, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-mauricio-pedro', 'desphuila', 'Mauricio Pedro', 'Médio', 8, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-jose-mendes', 'desphuila', 'José Mendes', 'Avançado', 10, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-emanuel-laurindo', 'desphuila', 'Emanuel Laurindo', 'Guarda-redes', 12, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-lucas-elias-antonio-paulo', 'desphuila', 'Ludy', 'Defesa', 13, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-elias-daniel', 'desphuila', 'Elias Daniel', 'Médio', 15, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-milton-alberto-de-oliveira-suca', 'desphuila', 'Milton', 'Avançado', 18, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-alegria-feliciano-safewange', 'desphuila', 'Alegria Feliciano Safewange', 'Médio', 19, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-duarte-kapoela', 'desphuila', 'Duarte Kapoela', 'Médio', 20, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-jenivaldo-afonso', 'desphuila', 'Jenivaldo Afonso', 'Guarda-redes', 22, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-florentino-antonio', 'desphuila', 'Florentino António', 'Defesa', 23, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-isidro-chingango', 'desphuila', 'Isidro Chingango', 'Defesa', 24, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-milagre-carlos-simba', 'desphuila', 'Milagre Carlos Simba', 'Avançado', 25, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-jeremias-pedro', 'desphuila', 'Jeremias Pedro', 'Defesa', 26, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-jose-augusto-camati', 'desphuila', 'Jose Augusto Camati', 'Avançado', 28, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-pequenino-castro', 'desphuila', 'Pequenino Castro', 'Médio', 29, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-diloy-cleberson-bernardo-valerio', 'desphuila', 'Diloy Cleberson Bernardo Valerio', 'Avançado', 31, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-jorge-ismael-jose-jose', 'desphuila', 'Jorge Ismael Jose Jose', 'Avançado', 33, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-joao-baptista-ferraz-samazanga-juny', 'desphuila', 'João Baptista Ferraz Samazanga Juny', 'Avançado', 34, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-mirovaldo-da-silva-vandunem', 'desphuila', 'Mirovaldo da Silva vandunem', 'Médio', 35, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-constantino-tchicundico-cassoma-tchitunda', 'desphuila', 'Constantino Tchicundico Cassoma Tchitunda', 'Médio', 32, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-antonio-pena', 'desphuila', 'António Pena', 'Médio', 27, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-angelo-cangu', 'desphuila', 'Angelo Cangu', 'Médio', 21, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('desphuila-nsambo-katendi', 'desphuila', 'NSAMBO KATENDI', 'Defesa', 2, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- CD 1.º de Agosto (dago) — 26 jogadores
delete from public.ancaf_players where team_id = 'dago';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('dago-axel-gaudencio-mabaqui-de-sousa-axel', 'dago', 'Axel Gaudêncio Mabaqui de Sousa Axel', null, 8, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-bonifacio-francisco-caetano', 'dago', 'Bonifacio Francisco Caetano', null, 5, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-milton-antonio-candido', 'dago', 'MILTON ANTONIO CANDIDO', null, 2, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-felisberto-kanjeque-lourenco-carvalho', 'dago', 'Felisberto Kanjeque Lourenço Carvalho', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-francisco-carlos-chilumbo', 'dago', 'Francisco Carlos Chilumbo', null, 20, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-samu-tshibamba-dago', 'dago', 'Samu Tshibamba Dago', null, 17, 28, 'Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-fernando-lopes-de-almeida', 'dago', 'FERNANDO LOPES DE ALMEIDA', null, 1, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-erique-joaquim-manuel-de-jesus', 'dago', 'ERIQUE JOAQUIM MANUEL DE JESUS', null, 24, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-simao-dianzenza', 'dago', 'Simao Dianzenza', null, 3, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-antonio-francisco-domingos', 'dago', 'ANTONIO FRANCISCO DOMINGOS', null, 7, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-eliseu-sebastiao-francisco-escalao-de-formacao', 'dago', 'Eliseu Sebastião Francisco ESCALÃO DE FORMAÇÃO', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-jose-macaia-ganga', 'dago', 'Jose Macaia ganga', null, 16, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-enoque-jose-kabesa', 'dago', 'Enoque José Kabesa', null, 23, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-venancio-landu-kukula', 'dago', 'Venancio Landu kukula', null, 15, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-florindo-machado', 'dago', 'Florindo Machado', null, 9, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-bruno-de-jesus-manuel', 'dago', 'Bruno de Jesus Manuel', null, 6, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-anselmo-mweni', 'dago', 'ANSELMO MWENI', null, 22, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-bencao-nbongo-evaristo-nzinga', 'dago', 'BENÇÃO NBONGO EVARISTO NZINGA', null, 36, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-obed-mayamb-mukokiani-obed', 'dago', 'Obed Mayamb Mukokiani Obed', null, 14, 31, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-afonso-dos-santos-paxe', 'dago', 'AFONSO DOS SANTOS PAXE', null, 19, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-carvalho-dos-santos', 'dago', 'Carvalho dos Santos', null, 27, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-calebi-yanda', 'dago', 'CALEBI YANDA', null, 10, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-fernando-inacio-costa', 'dago', 'Fernando Inácio Costa', null, 11, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-cliver-camango-andre', 'dago', 'Cliver Camango Andre', null, 18, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-felix-bulaya', 'dago', 'Felix Bulaya', null, 28, 29, 'Zambia', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('dago-luciano-manuel-dos-santos', 'dago', 'Luciano Manuel dos Santos', null, 25, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Kabuscorp SC (kabuscorp) — 25 jogadores
delete from public.ancaf_players where team_id = 'kabuscorp';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('kabuscorp-mankoka-hegene-afonso', 'kabuscorp', 'Mankoka Hegene Afonso', 'Avançado', 18, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-saombe-sukuakueche-angelo-jorge', 'kabuscorp', 'Saombe Sukuakueche Ángelo Jorge', 'Defesa', 5, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-eliseu-cabanga', 'kabuscorp', 'Eliseu', 'Defesa', 3, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-aluizio-joel-andre-cacharamba', 'kabuscorp', 'Aluízio Joel André Cacharamba', 'Médio', 27, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-teodoro-fernandes-correia', 'kabuscorp', 'TEODORO FERNANDES CORREIA', 'Defesa', 11, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-joao-baptista-missenga-de-nascimento', 'kabuscorp', 'JOÃO BAPTISTA MISSENGA DE NASCIMENTO', 'Guarda-redes', 12, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-adair-garcia-domingos', 'kabuscorp', 'ADAIR GARCIA DOMINGOS', 'Defesa', 4, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-diogenes-capemba-joao', 'kabuscorp', 'DIÓGENES CAPEMBA JOÃO', 'Médio', 32, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-daniel-kilola', 'kabuscorp', 'DANIEL KILOLA', 'Médio', 15, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-zamorano-lopes', 'kabuscorp', 'Zamorano Lopes', 'Defesa', 2, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-celestino-luis-maleco', 'kabuscorp', 'MONA MALECO', 'Avançado', 17, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-artur-malungo', 'kabuscorp', 'ARTUR MALUNGO', 'Defesa', 14, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-henock-mangindula', 'kabuscorp', 'Henock Mangindula', 'Defesa', 16, 26, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-jorge-manuel-pinto', 'kabuscorp', 'JORGE MANUEL PINTO', 'Médio', 35, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-mvemba-matondo-kuanzambi', 'kabuscorp', 'MVEMBA MATONDO KUANZAMBI', 'Defesa', 28, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-augusto-monteiro-mualucano', 'kabuscorp', 'AUGUSTO MONTEIRO MUALUCANO', 'Guarda-redes', 22, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-bayala-nsimba', 'kabuscorp', 'BAYALA NSIMBA', 'Avançado', 7, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-joaquim-paciencia', 'kabuscorp', 'JOAQUIM PACIENCIA', 'Avançado', 19, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-enoque-benjamim-tula', 'kabuscorp', 'ENOQUE BENJAMIM TULA', 'Médio', 20, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-jose-semedo-vunge', 'kabuscorp', 'José Semedo Vunge', 'Médio', 10, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-alberto-elizeu-xavier', 'kabuscorp', 'Alberto Elizeu Xavier', 'Avançado', 29, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-mazebo-mavambo-joao', 'kabuscorp', 'MAZEBO MAVAMBO JOÃO', 'Guarda-redes', 21, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-liwanda-joslin-ndongala', 'kabuscorp', 'LIWANDA JOSLIN NDONGALA', 'Defesa', 13, 23, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-tresor-kuyu-nona', 'kabuscorp', 'Tresor Kuyu Nona', 'Avançado', 25, 25, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('kabuscorp-mbali-mongbongo-sem', 'kabuscorp', 'MBALI MONGBONGO SEM', 'Médio', 8, 23, 'Democratic Republic of the Congo', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Académica do Lobito (lobito) — 28 jogadores
delete from public.ancaf_players where team_id = 'lobito';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('lobito-lourenco-cambiombo-sapalo-adriano', 'lobito', 'LOURENÇO CAMBIOMBO SAPALO ADRIANO', 'Médio', 5, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-jorge-umba-baiao', 'lobito', 'JORGE UMBA BAIÃO', 'Defesa', 28, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-gervasio-domingos-calela', 'lobito', 'GERVÁSIO DOMINGOS CALELA', 'Defesa', 13, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-joaquim-francisco-cambanda', 'lobito', 'CHICO PAPEL', 'Médio', 16, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-rosario-adao-da-costa-cavanda', 'lobito', 'Rósario Adao Da Costa Cavanda', 'Defesa', 4, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-miguel-dos-santos', 'lobito', 'PANZO', 'Médio', 24, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-fernando-elias-kachikapa', 'lobito', 'FERNANDO ELIAS KACHIKAPA', 'Defesa', 36, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-geraraldo-perdo-feliciano', 'lobito', 'GERALDO NDJELA', 'Médio', 21, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-florentino-vasco-gomes-matemba', 'lobito', 'FLORENTINO VASCO GOMES MATEMBA', 'Avançado', 11, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-jose-keta-gonga', 'lobito', 'JOSÉ KETA GONGA', 'Defesa', 22, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-marcos-yaniki-canduco-holivio', 'lobito', 'MARCOS YANIKI CANDUCO HOLIVIO', 'Guarda-redes', 40, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-joel-manzambi-kibango-jorge', 'lobito', 'JOEL MANZAMBI KIBANGO JORGE', 'Defesa', 2, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-ezequiel-paulo-juliao', 'lobito', 'Ezequiel Paulo Julião', 'Médio', 10, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-aurelio-nivete-lopai-kapuca-heli', 'lobito', 'AURÉLIO NIVETE LOPAI KAPUCA ( HELI)', 'Avançado', 33, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-leonel-augusto-mateus-lemos', 'lobito', 'LEONEL AUGUSTO MATEUS LEMOS', 'Defesa', 38, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-manuel-pereira-londaka', 'lobito', 'Manuel Pereira Londaka', 'Médio', 6, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-mauricio-mwatenda-lucas-farrada', 'lobito', 'FARRADA', 'Defesa', 26, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-nanga-joao-manuel', 'lobito', 'NANGA JOÃO MANUEL', 'Defesa', 3, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-serafim-paulina-mapussa', 'lobito', 'JOJO', 'Médio', 15, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-luis-nfumaiasoka-miguel-panda', 'lobito', 'LUÍS NFUMAIASOKA MIGUEL PANDA', 'Médio', 31, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-antonio-silvio-morais', 'lobito', 'CAVALO', 'Avançado', 19, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-guilherme-alberto-muhango', 'lobito', 'GUILHERME ALBERTO MUHANGO', 'Defesa', 12, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-andre-alfredo-joao-panda', 'lobito', 'ANDRÉ ALFREDO JOÃO PANDA', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-januario-da-cruz-sesa', 'lobito', 'JANUÁRIO DA CRUZ SESA', 'Médio', 7, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-valerio-magrinho-troco-zaire', 'lobito', 'VALÉRIO MAGRINHO TROCO ZAIRE', 'Médio', 29, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-carlos-antonio-correia', 'lobito', 'CARLOS ANTÓNIO CORREIA', 'Defesa', 35, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-jorge-enio-antonio-da-costa', 'lobito', 'JORGE ENIO ANTONIO DA COSTA', 'Defesa', 27, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lobito-wilson-david', 'lobito', 'WILSON DAVID', 'Defesa', 25, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- FC Luanda (fcluanda) — 23 jogadores
delete from public.ancaf_players where team_id = 'fcluanda';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('fcluanda-joao-maduvo-capita-cafula', 'fcluanda', 'JOAO MADUVO CAPITA CAFULA', 'Guarda-redes', 1, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-denilson', 'fcluanda', 'DENILSON', 'Avançado', 10, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-ludiakueno', 'fcluanda', 'LUDIAKUENO', 'Guarda-redes', 12, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-domingos', 'fcluanda', 'DOMINGOS', 'Médio', 14, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-domingos-2', 'fcluanda', 'DOMINGOS', 'Médio', 25, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-estevao-cahoko', 'fcluanda', 'Estevao Cahoko', 'Médio', 24, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-francisco', 'fcluanda', 'FRANCISCO', 'Avançado', 9, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-joel-diaku', 'fcluanda', 'Joel Diaku', 'Defesa', 4, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-arnaldo-dielo', 'fcluanda', 'Arnaldo Dielo', 'Médio', 16, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-batista-jao-kachama-kachama', 'fcluanda', 'BATISTA JÁO KACHAMA KACHAMA', 'Médio', 27, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-ruben-cristiano-mbala-luwawa', 'fcluanda', 'RUBEN CRISTIANO MBALA LUWAWA', 'Médio', 15, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-filipe-malanda', 'fcluanda', 'Filipe Malanda', 'Defesa', 17, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-jonilson-jose-manuel-manuel', 'fcluanda', 'Jonilson José Manuel Manuel', 'Defesa', 6, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-celio-nimi', 'fcluanda', 'Celio Nimi', 'Médio', 26, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-kano', 'fcluanda', 'KANO', 'Avançado', 31, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-pedro', 'fcluanda', 'PEDRO', 'Médio', 7, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-jaime', 'fcluanda', 'JAIME', 'Médio', 30, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-gelson-dos-santos-andre-gelson', 'fcluanda', 'Gelson Dos Santos André Gelson', 'Médio', 8, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-miguel-nzau-manuel-matos', 'fcluanda', 'MIGUEL NZAU MANUEL MATOS', 'Médio', 23, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-deo', 'fcluanda', 'DEO', 'Guarda-redes', 22, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-pedro-2', 'fcluanda', 'PEDRO', 'Defesa', 28, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-euclides-dos-santos', 'fcluanda', 'Euclides Dos Santos', 'Médio', 5, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('fcluanda-hamilton', 'fcluanda', 'HAMILTON', 'Médio', 2, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Recreativo do Libolo (libolo) — 23 jogadores
delete from public.ancaf_players where team_id = 'libolo';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('libolo-andre', 'libolo', 'Andre', null, 10, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-adelino-wima-calunhi-antonio', 'libolo', 'ADELINO WIMA CALUNHI ANTONIO', null, 5, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-zidan-bernardo-antonio-francisco', 'libolo', 'Zidan Bernardo António Francisco', null, 22, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-jose', 'libolo', 'JOSÉ', null, 19, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-marcos', 'libolo', 'MARCOS', null, 3, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-zinadine-zidane-moises-catraio', 'libolo', 'Zinadine Zidane Moises Catraio', null, 24, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-cardoso-ernesto-vieira-chicaiango', 'libolo', 'CARDOSO ERNESTO VIEIRA CHICAIANGO', null, 2, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-edmilson-joao-francisco-cuxixima', 'libolo', 'Edmilson Joao Francisco Cuxixima', null, 27, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-gerson-francisco-chimbele-da-costa', 'libolo', 'GERSON FRANCISCO CHIMBELE DA COSTA', null, 6, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-manuel-jacinto-domingos', 'libolo', 'Manuel Jacinto Domingos', null, 28, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-bernardo-lomanda-kamutcha-gunda', 'libolo', 'Bernardo Lomanda kamutcha Gunda', 'Guarda-redes', 12, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-joao-mario-justino-jamba', 'libolo', 'João Mário Justino Jamba', 'Guarda-redes', 20, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-joel-kaluvala-alexandre-lucamba', 'libolo', 'Joel Kaluvala Alexandre Lucamba', null, 30, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-aristotes-kingui-makani', 'libolo', 'ARISTOTES KINGUI MAKANI', null, 4, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-manuel-manjolo', 'libolo', 'Manuel Manjolo', null, 14, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-pedro-afonso-massaki', 'libolo', 'PEDRO AFONSO MASSAKI', null, 17, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-jorge', 'libolo', 'JORGE', null, 15, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-salomao-mukanda', 'libolo', 'Salomão Mukanda', null, 25, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-fernando-jose-paulino-lourenco', 'libolo', 'Fernando José Paulino Lourenço', null, 16, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-vandelson-estevao-pedro-joao', 'libolo', 'Vandelson Estevão Pedro João', null, 23, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-ilidio-da-silva', 'libolo', 'Ilidio da Silva', null, 8, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-amado-tiago-marques-haidara', 'libolo', 'AMADO TIAGO MARQUES HAIDARA', null, 18, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('libolo-diogo-da-rocha-quiamesso', 'libolo', 'DIOGO DA ROCHA QUIAMESSO', null, 11, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- CR Caála (caala) — 26 jogadores
delete from public.ancaf_players where team_id = 'caala';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('caala-tiago-jamba-adelino', 'caala', 'TIAGO JAMBA ADELINO', 'Avançado', 33, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-benvindo-miguel-andre-afonso', 'caala', 'BENVINDO MIGUEL ANDRÉ AFONSO', 'Médio', 04, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-felix-cassule-andre', 'caala', 'FELIX CASSULE ANDRE', 'Defesa', 26, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-benedito-antunes', 'caala', 'Benedito Antunes', 'Médio', 19, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-francisco', 'caala', 'FRANCISCO', 'Defesa', 16, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-domingos-lourenco-cuxixima', 'caala', 'Domingos Lourenço Cuxixima', 'Avançado', 07, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-jose-afonso-dos-santos-fernando', 'caala', 'JOSE AFONSO DOS SANTOS FERNANDO', 'Guarda-redes', 30, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-domingos-braga-laurindo-fernando', 'caala', 'Domingos Braga Laurindo Fernando', 'Médio', 29, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-osvaldo', 'caala', 'Osvaldo', 'Médio', 06, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-albano-kupenala', 'caala', 'ALBANO KUPENALA', 'Defesa', 03, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-estevao-lussendje', 'caala', 'ESTEVÂO LUSSENDJE', 'Guarda-redes', 12, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-goncalves-zinho-manico', 'caala', 'Gonçalves Zinho Manico', 'Defesa', 21, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-landu', 'caala', 'Landu', 'Guarda-redes', 22, 36, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-manuel-zange-miguel', 'caala', 'Manuel Zange Miguel', 'Médio', 20, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-lourenco-antonio-pereira', 'caala', 'LOURENÇO ANTÓNIO PEREIRA', 'Médio', 31, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-jose-manuel-raul', 'caala', 'JOSÉ MANUEL RAUL', 'Avançado', 27, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-valentim-sacuvale', 'caala', 'valentim sacuvale', 'Defesa', 02, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-timoteo-sambissa', 'caala', 'Timoteo Sambissa', 'Avançado', 24, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-hermenegildo-sandumbo', 'caala', 'VALENTE', 'Avançado', 09, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-abel-silas-sequesseque', 'caala', 'SEQUESSEQUE', 'Defesa', 25, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-lisneu-emanuel-neto-simao', 'caala', 'LISNEU EMANUEL NETO SIMAO', 'Médio', 23, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-claudio-sozinho', 'caala', 'Claúdio Sozinho', 'Médio', 08, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-gabriel', 'caala', 'GABRIEL', 'Avançado', 17, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-mariano-da-costa-vidal', 'caala', 'MARIANO DA COSTA VIDAL', 'Defesa', 15, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-arilson-de-ceita-pereira-jorge', 'caala', 'ARILSON DE CEITA PEREIRA JORGE', 'Médio', 10, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('caala-ernesto', 'caala', 'ERNESTO', 'Avançado', 34, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- GD Interclube (interclube) — 27 jogadores
delete from public.ancaf_players where team_id = 'interclube';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('interclube-anderson-arieu-calengue-afonso', 'interclube', 'ANDERSON ARIEU CALENGUE AFONSO', 'Médio', 17, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-osvaldo-augusto-francisco', 'interclube', 'Osvaldo Augusto Francisco', 'Defesa', 27, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-afonso-baptista', 'interclube', 'Afonso Baptista', 'Avançado', 36, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-domingos-miguel-bravo', 'interclube', 'DOMINGOS MIGUEL BRAVO', 'Defesa', 26, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-salomao', 'interclube', 'SALOMÃO', 'Defesa', 5, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-alexandre-domingos-ngunza-caculo', 'interclube', 'ALEXANDRE DOMINGOS NGUNZA CACULO', 'Médio', 37, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-lionel-joao-barao-cambuta', 'interclube', 'Lionel João Barão Cambuta', 'Defesa', 2, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-walter-emanuel-de-sa-carvalho-carvalho', 'interclube', 'WALTER EMANUEL DE SÁ CARVALHO CARVALHO', 'Avançado', 20, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-pedro-honjo-chimbiambinlu', 'interclube', 'PEDRO HONJO CHIMBIAMBINLU', 'Avançado', 10, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-octavio-leite-fernandes-cruz', 'interclube', 'OCTAVIO LEITE FERNANDES CRUZ', 'Médio', 21, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-moises', 'interclube', 'MOISÉS', 'Defesa', 28, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-pedro-ganga', 'interclube', 'Pedro Ganga', 'Médio', 32, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-paulo', 'interclube', 'PAULO', 'Defesa', 33, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-fredy-da-graca-sebastiao-lopes', 'interclube', 'FREDY DA GRAÇA SEBASTIÃO LOPES', 'Defesa', 39, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-jonas-kaqueia-lucas', 'interclube', 'JONAS KAQUEIA LUCAS', 'Avançado', 35, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-alberto', 'interclube', 'ALBERTO', 'Médio', 6, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-jorge', 'interclube', 'JORGE', 'Guarda-redes', 22, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-pedro-gabriel-malanda-miguel', 'interclube', 'PEDRO GABRIEL MALANDA MIGUEL', 'Médio', 8, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-silvano-monteiro', 'interclube', 'SILVANO MONTEIRO', 'Avançado', 30, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-analtino-jose-fernando-mualifangue', 'interclube', 'ANALTINO JOSÉ FERNANDO MUALIFANGUE', 'Médio', 31, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-alcides-patricio', 'interclube', 'Alcides Patrício', 'Médio', 14, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-gabriel-samuel-panzo', 'interclube', 'GABRIEL SAMUEL PANZO', 'Guarda-redes', 12, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-pascoal-paulino', 'interclube', 'Pascoal Paulino', 'Defesa', 23, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-edivaldo', 'interclube', 'EDIVALDO', 'Defesa', 18, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-fernando-jacinto-quissanga', 'interclube', 'FERNANDO JACINTO QUISSANGA', 'Defesa', 25, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-bartolomeu-taivando-anacleto-sachimala', 'interclube', 'Bartolomeu Taivando Anacleto Sachimala', 'Avançado', 38, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('interclube-felisberto', 'interclube', 'FELISBERTO', 'Avançado', 29, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Bravos do Maquis (bravos) — 26 jogadores
delete from public.ancaf_players where team_id = 'bravos';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('bravos-jeronimo-mendes-abrao', 'bravos', 'Jeronimo Mendes Abrao', null, 6, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-agnaldo-emerson-catanga', 'bravos', 'Agnaldo', null, 3, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-oliveira-antonio', 'bravos', 'OLIVEIRA ANTONIO', null, 27, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-manuel-pombolo-antonio', 'bravos', 'MANUEL POMBOLO ANTÓNIO', null, 22, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-luis-caetano-paquete', 'bravos', 'LUÍS CAETANO PAQUETE', null, 23, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-filipe-prego-candumbo', 'bravos', 'Caprego', null, 24, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-jorge-correia', 'bravos', 'JORGE CORREIA', null, 19, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-higino-epalanga', 'bravos', 'Higino Epalanga', null, 10, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-joffre-faztudo', 'bravos', 'Joffre Faztudo', null, 20, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-luis-venancio-feliciano-direito', 'bravos', 'LUÍS VENÂNCIO FELICIANO DIREITO', null, 14, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-edmilson-paulo-generoso', 'bravos', 'Edmilson Paulo Generoso', null, 29, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-luis-goncalves', 'bravos', 'Luis Gonçalves', null, 26, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-eric-manuel-gouveia-cabral', 'bravos', 'Eric Manuel Gouveia Cabral', null, 8, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-yubanis-joao', 'bravos', 'Yubanis Joao', null, 31, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-santos-nkiambi-kiaku', 'bravos', 'SANTOS NKIAMBI KIAKU', null, 32, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-belito-batalha-messias', 'bravos', 'Lionardo', null, 12, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-eduwine-alfredo-dos-vantrier', 'bravos', 'Eduwine Alfredo Dos Vantrier', null, 17, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-andre-dinis', 'bravos', 'Muhongo', null, 21, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-ataide-bule-neves', 'bravos', 'GELSON', null, 9, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-danilson-jose-pedro-alberto', 'bravos', 'DANILSON JOSÉ PEDRO ALBERTO', null, 2, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-miguel-jose-sebastiao', 'bravos', 'MIGUEL JOSÉ SEBASTIÃO', null, 7, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-gastao-tangu', 'bravos', 'GASTÃO TANGU', null, 28, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-chukwumela-bright-osah', 'bravos', 'CHUKWUMELA BRIGHT OSAH', null, 16, 26, 'Nigéria', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-tiago-uzana', 'bravos', 'Fota', null, 15, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-antonio-jose', 'bravos', 'ANTONIO JOSE', null, null, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('bravos-bruno-trindade', 'bravos', 'BRUNO TRINDADE', null, null, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Sagrada Esperança (sagrada) — 53 jogadores
delete from public.ancaf_players where team_id = 'sagrada';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('sagrada-charles-abel', 'sagrada', 'Charles Abel', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-hahilo-sapalo-alberto', 'sagrada', 'HAHILO SAPALO ALBERTO', null, 32, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-claudio-barbosa', 'sagrada', 'CLAUDIO BARBOSA', null, 33, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-miguel-anselmo-basilio-daniel', 'sagrada', 'MIGUEL ANSELMO BASILIO DANIEL', null, 5, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-guilherme-francisco-saiendo', 'sagrada', 'CABUÇO', null, 8, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-felisberto-augusto-calumbula', 'sagrada', 'FELISBERTO AUGUSTO CALUMBULA', null, 35, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-carlos-neves-camoxi', 'sagrada', 'CARLOS NEVES CAMOXI', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-henriques-americo-henda', 'sagrada', 'CAPANDA', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-alfino-gomes-chidi-pinto', 'sagrada', 'ALFINO GOMES CHIDI PINTO', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-antonio-sozinho-chora', 'sagrada', 'FERNANDO', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-melone-moundo', 'sagrada', 'Dala', null, 11, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-dadinho-inocencio-augusto', 'sagrada', 'DE DEUS', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adilson-miguel-sebastiao', 'sagrada', 'Dodão', null, 19, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-bartolomeu-domingos', 'sagrada', 'Bartolomeu Domingos', null, 14, 37, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-silvano-mauro-dos-santos', 'sagrada', 'Silvano Mauro Dos Santos', null, 18, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-nsesani-emanuel', 'sagrada', 'SIMÃO', null, 12, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-nzunzi-garcia', 'sagrada', 'ESCALÃO DE FORMAÇÃO', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adilson-ndambo-fatima', 'sagrada', 'CONGOLO', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-julio-capalo', 'sagrada', 'FAUSTINO', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-osvaldo-santos-florinda', 'sagrada', 'ANTÓNIO', null, 36, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-jorge-txando', 'sagrada', 'FRANCISCO LUCUSSA', null, 9, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-nzuzi-panzo', 'sagrada', 'GARCIAS', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-elisio-sarafim', 'sagrada', 'GUERRA', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-marcos-francisco-joao', 'sagrada', 'MUACHEFO', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-ngoi-katabu', 'sagrada', 'JOÃO MUBANGA', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adilson-mario-jorge', 'sagrada', 'PINTO', null, 15, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-fernando-cahilo-jose', 'sagrada', 'MAITONYI', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-francisco-neves', 'sagrada', 'Junior Neves', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-domingos-jose-kandumba', 'sagrada', 'DOMINGOS JOSÉ KANDUMBA', null, 34, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-zacarias-muzaula', 'sagrada', 'KAPUITA', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-evaristo-kapunge', 'sagrada', 'EVARISTO KAPUNGE', null, 4, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-palanga-txitembo', 'sagrada', 'LAURINDA MBUMBUM', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adolfo-loua', 'sagrada', 'ADOLFO LOUA', null, 30, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-samuel-lukengani', 'sagrada', 'SAMUEL LUKENGANI', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-afonso-marques', 'sagrada', 'AFONSO MARQUES', null, 24, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-sapalo-caipuzo', 'sagrada', 'MAURÍCIO ANDRÉ', null, 31, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-simone-eduardo-assa', 'sagrada', 'MIRANDA', null, 10, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-txigica-muandange', 'sagrada', 'TXIGICA MUANDANGE', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-joao-ngunza', 'sagrada', 'Muanha', null, 17, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adilson-caxala', 'sagrada', 'MUATANGUI', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-leonardo-armando-mutunda', 'sagrada', 'LEONARDO ARMANDO MUTUNDA', null, 13, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-paulo-albano-neto', 'sagrada', 'PAULO ALBANO NETO', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-barreira-paulo', 'sagrada', 'Barreira Paulo', null, 28, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-filipe-pimpao', 'sagrada', 'Filipe Pimpao', null, 16, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-chimuna-upite', 'sagrada', 'RONALDO', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-brigue-domingos', 'sagrada', 'SANDRA GONZAGAS', null, 29, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-felisberto-dala', 'sagrada', 'Sebastiao', null, 7, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-adao-mulumba', 'sagrada', 'SUPULA MUNTO', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-luis-bumba', 'sagrada', 'TATI', null, 20, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-maria-filipe', 'sagrada', 'VIEIGAS SIMÃO', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-manuel-vunge', 'sagrada', 'MANUEL VUNGE', null, 3, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-alexandre-abel-fernando', 'sagrada', 'ALEXANDRE ABEL FERNANDO', null, 2, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('sagrada-messias-pires', 'sagrada', 'NEVES', null, 21, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Desportivo da Lunda Sul (lundasul) — 79 jogadores
delete from public.ancaf_players where team_id = 'lundasul';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('lundasul-antonio-ezequiel-mussazeno', 'lundasul', 'AFONSO', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-ambrosio', 'lundasul', 'João Ambrosio', null, 28, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-manuel-antonio', 'lundasul', 'Manuel António', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-gustavo-bartolomeu-upuo', 'lundasul', 'Baptista', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-trindade-baptista', 'lundasul', 'Trindade Baptista', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-reclenio-paulo-alberto', 'lundasul', 'Bernardo', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-afonso-manuel-binga', 'lundasul', 'MONGA DIÉ', null, 23, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-bivoba', 'lundasul', 'Zau', null, 35, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-isaac-bomashi', 'lundasul', 'Isaac BOMASHI', null, null, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-jose-bondoso', 'lundasul', 'José Bondoso', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-manuel-tchinhanguita', 'lundasul', 'CACHINDELE', null, 19, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-caebo', 'lundasul', 'JOAO CAEBO', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-silvano', 'lundasul', 'caluvili', null, 33, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-sergio-capenda', 'lundasul', 'Sergio CAPENDA', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-baptista-cassicote', 'lundasul', 'João Baptista Cassicote', null, 27, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-raimundo-epalanga', 'lundasul', 'CASSINDA', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-catorze', 'lundasul', 'JOAO CATORZE', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-ajair-cazenga', 'lundasul', 'AJAIR CAZENGA', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-aires-chicunji', 'lundasul', 'AIRES CHICUNJI', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-alves-chicunji', 'lundasul', 'ALVES CHICUNJI', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-custodio-txifita', 'lundasul', 'Chitazo', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-anselmo-caetano', 'lundasul', 'BAIÃO DA SILVA', null, null, 14, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-mauro-zeferino', 'lundasul', 'Da Silva', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-jarelson-ariclenes', 'lundasul', 'FIGUEIRA DALA', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-ervinecio-daniel', 'lundasul', 'BICHO', null, null, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-claudio-daniel', 'lundasul', 'CLAÚDIO DANIEL', null, 37, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-manuel-daniel', 'lundasul', 'MANUEL DANIEL', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-tomas-dias', 'lundasul', 'Tomás Dias', null, 41, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-jorge-dos-santos', 'lundasul', 'JORGE DOS SANTOS', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-mucuta-elias', 'lundasul', 'MUCUTA ELIAS', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-andre-sumano', 'lundasul', 'Jorge Feliciano', null, null, 13, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-amorim-filipe', 'lundasul', 'AMORIM FILIPE', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-felix-honjo', 'lundasul', 'FELIX HONJO', null, 11, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-graca-mucuasseno', 'lundasul', 'DULCE HOSSI', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-reis', 'lundasul', 'Justa Inhingui', null, null, 14, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-carlos-sonhi', 'lundasul', 'CHÉCHA ITULIQUENO', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-upite-vicano', 'lundasul', 'JAMBA', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-joaquim', 'lundasul', 'João Joaquim', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-jovial-justino', 'lundasul', 'Jovial Justino', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-mario-bernardo', 'lundasul', 'KETA', null, 26, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-canda-ivone', 'lundasul', 'LEONARDO', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-verissimo-loloji', 'lundasul', 'Veríssimo Loloji', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-jairo-de-sousa', 'lundasul', 'Tchilihi Luamba', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-amilton-luifi', 'lundasul', 'Amilton Luifi', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-januario-manuel', 'lundasul', 'JANUÁRIO MANUEL', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-osvaldo-miguel', 'lundasul', 'OSVALDO MIGUEL', null, 8, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-wamana-mocambique', 'lundasul', 'WAMANA MOÇAMBIQUE', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-zango-muachissengue', 'lundasul', 'Zango Muachissengue', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-vidal-muachissengue', 'lundasul', 'Vidal Muachissengue', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-felix-mukenie', 'lundasul', 'Felix Mukenie', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-niongonona-muliquita', 'lundasul', 'NIONGONONA MULIQUITA', null, 2, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-manowa-mulonga', 'lundasul', 'MANOWA MULONGA', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-henriques-mutambuleno', 'lundasul', 'HENRIQUES MUTAMBULENO', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-antonio-ngola', 'lundasul', 'NGULU', null, 17, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-elindo-wanga', 'lundasul', 'PAULINO', null, 6, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-atavares-pinto', 'lundasul', 'Atavares Pinto', null, 34, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-anselmo-raimundo', 'lundasul', 'ANSELMO RAIMUNDO', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-inocencio-rui', 'lundasul', 'INOCENCIO RUI', null, 7, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-sacaputo', 'lundasul', 'João Sacaputo', null, null, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-amilcar-lucas', 'lundasul', 'AFONSO SAMAIUQUE', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-ivano-de-oliveira', 'lundasul', 'MUAFUNGA SAMALACA', null, null, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-eliseu-samuzeca', 'lundasul', 'Eliseu Samuzeca', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-admiro-sanjamba', 'lundasul', 'ADMIRO SANJAMBA', null, null, 16, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-benvindo-iamuno', 'lundasul', 'CAMUOIO SANTOMEIA', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-luitxi-jorge', 'lundasul', 'DA CRUZ AUGUSTO SECRETÁRIO', null, null, 14, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joao-tchiginga', 'lundasul', 'Joao Tchiginga', null, 4, 30, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-tarcio-cristiano', 'lundasul', 'TITO', null, null, 15, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-braulio-michel', 'lundasul', 'AFONSO TXICATA', null, null, 14, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-horacio-do-rosario', 'lundasul', 'Upale Txitoma', null, null, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-maranata-domingos', 'lundasul', 'Sicuba Vunge', null, 10, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-antonio-vungo', 'lundasul', 'António Vungo', null, null, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-adalberto-wacamba', 'lundasul', 'ADALBERTO WACAMBA', null, 12, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-manuel-afonso', 'lundasul', 'NDONGALA XILI', null, null, 14, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-domingos-ximba', 'lundasul', 'Domingos Ximba', null, 16, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-dieu-maquissossila', 'lundasul', 'David', null, 25, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-frederico-xangongo', 'lundasul', 'Singongo', null, 5, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-joaquim-teixeira', 'lundasul', 'JOAQUIM TEIXEIRA', null, 20, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-pedro-domingos', 'lundasul', 'AGOSTINHO', null, 30, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('lundasul-hanilton-cassueca', 'lundasul', 'Nguala', null, 3, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- São Salvador (saosalvador) — 34 jogadores
delete from public.ancaf_players where team_id = 'saosalvador';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('saosalvador-joao-adriano', 'saosalvador', 'JOÃO ADRIANO', 'Avançado', 3, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-pacheco-guilherme-francisco-alfredo', 'saosalvador', 'PACHECO GUILHERME FRANCISCO ALFREDO', 'Médio', 15, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-manuel-vieira-almeida', 'saosalvador', 'MANUEL VIEIRA ALMEIDA', 'Defesa', 16, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-afonso-lukombo-antonio', 'saosalvador', 'AFONSO LUKOMBO ANTONIO', 'Avançado', 9, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-matondo-kuanzambi-jose-bengi', 'saosalvador', 'Matondo Kuanzambi Jose Bengi', 'Guarda-redes', 1, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-samuel-chissapa-cachimbombo', 'saosalvador', 'Samuel Chissapa Cachimbombo', 'Avançado', 21, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-justino-tchitepa-cesar', 'saosalvador', 'JUSTINO TCHITEPA CÉSAR', 'Médio', 27, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-manuel-de-matos', 'saosalvador', 'MANUEL DE MATOS', 'Médio', 4, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-batomene-de-sousa', 'saosalvador', 'BATOMENE DE SOUSA', 'Avançado', 7, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-augusto-fecayamale', 'saosalvador', 'FECA', 'Defesa', 5, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-fernando-lizandro-firmino-camuege-fernando', 'saosalvador', 'BIJO', 'Médio', 6, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-lando-simao-filipe', 'saosalvador', 'Lando Simao Filipe', 'Avançado', 14, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-artur-firmino', 'saosalvador', 'ARTUR FIRMINO', 'Defesa', 34, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-jose-garcia', 'saosalvador', 'José Garcia', 'Defesa', 2, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-caetano-gomes', 'saosalvador', 'CAETANO GOMES', 'Avançado', 30, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-joao-kuanzambi-lukombo-junior', 'saosalvador', 'JOÃO KUANZAMBI LUKOMBO JUNIOR', 'Avançado', 32, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-antonio-jose-xaviei-junior', 'saosalvador', 'ANTÓNIO JOSÉ XAVIEI JUNIOR', 'Defesa', 11, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-ariclenes-carlos-lopes-antonio', 'saosalvador', 'ARICLENES CARLOS LOPES ANTÓNIO', 'Médio', 10, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-lucas-filemon-cassule-lucas', 'saosalvador', 'LUQUINHAS', 'Avançado', 17, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-francisco-mangala', 'saosalvador', 'FRANCISCO MANGALA', 'Guarda-redes', 12, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-antonio-joaquim-mateus', 'saosalvador', 'António Joaquim Mateus', 'Guarda-redes', 31, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-eduardo-moyo', 'saosalvador', 'EDUARDO MOYO', 'Médio', 22, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-pedro-moyo', 'saosalvador', 'Pedro Moyo', 'Guarda-redes', 35, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-felix-gonga-muondo', 'saosalvador', 'Felix Gonga Muondo', 'Médio', 19, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-paulo-amadeu-panda', 'saosalvador', 'PAULO AMADEU PANDA', 'Médio', 18, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-jonas-rodrigues', 'saosalvador', 'JONAS RODRIGUES', 'Defesa', 23, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-lutonda-joao-sebastiao', 'saosalvador', 'LUTONDA JOÃO SEBASTIÃO', 'Avançado', 33, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-wilson-goncalves-tenete', 'saosalvador', 'WILSON GONÇALVES TENETE', 'Defesa', 25, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-rafael-sete-ucuahamba-ucuahamba', 'saosalvador', 'Ramilton', 'Defesa', 13, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-joao-andre-vemba', 'saosalvador', 'JOÃO ANDRÉ VEMBA', 'Médio', 8, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-nginakanda-antonio-vicente', 'saosalvador', 'NGINAKANDA ANTÓNIO VICENTE', 'Defesa', 20, 35, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-constantino-jose-domingos', 'saosalvador', 'CONSTANTINO JOSÉ DOMINGOS', 'Médio', 28, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-rivaldo-santos-pacheco', 'saosalvador', 'RIVALDO SANTOS PACHECO', 'Médio', 29, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('saosalvador-anderson-de-jesus-luis-mputa', 'saosalvador', 'Anderson de Jesus Luís Mputa', 'Avançado', 26, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- Petro de Luanda (petro) — 28 jogadores
delete from public.ancaf_players where team_id = 'petro';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('petro-ruben-constantino-aderito', 'petro', 'Ruben Constantino Adérito', 'Defesa', 4, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-jairo-antonio-bento-muanha', 'petro', 'JAIRO ANTÓNIO BENTO MUANHA', 'Médio', 34, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-ilidio-augusto-bunga-panda', 'petro', 'ILÍDIO AUGUSTO BUNGA PANDA', 'Avançado', 33, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-domingos-da-silva', 'petro', 'DOMINGOS DA SILVA', 'Guarda-redes', 38, 20, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-lourenco-jose-didissa', 'petro', 'LOURENÇO JOSÉ DIDISSA', 'Defesa', 31, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-tiago-rodrigues-dos-reis', 'petro', 'TIAGO RODRIGUES DOS REIS', 'Avançado', 23, 27, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-gabriel-heitor-fernandes-da-silva', 'petro', 'GABRIEL HEITOR FERNANDES DA SILVA', 'Médio', 39, 17, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-jorge-javier-moreira-pereira', 'petro', 'JORGE JAVIER MOREIRA PEREIRA', 'Médio', 20, 28, 'Venezuela', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-jonathan-josue-rubio-toro', 'petro', 'JONATHAN JOSUE RUBIO TORO', 'Médio', 8, 29, 'Honduras', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-ivan-ricardo-neves-abreu-cavaleiro', 'petro', 'IVAN RICARDO NEVES ABREU CAVALEIRO', 'Avançado', 7, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-mario-cesar-azevedo-alves-balburdia', 'petro', 'MÁRIO CÉSAR AZEVEDO ALVES BALBÚRDIA', 'Médio', 6, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-leonardo-da-costa-bolgado', 'petro', 'LEONARDO DA COSTA BOLGADO', 'Defesa', 5, 28, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-agostinho-jose-julio-calunga', 'petro', 'Agostinho José Júlio Calunga', 'Guarda-redes', 30, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-adilson-cipriano-da-cruz', 'petro', 'Adilson Cipriano da Cruz', 'Guarda-redes', 22, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-joaquim-marcos-cunga-balanga', 'petro', 'JOAQUIM MARCOS CUNGA BALANGA', 'Defesa', 24, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-bernardo-silva-da-conceicao', 'petro', 'BERNARDO SILVA DA CONCEIÇÃO', 'Médio', 13, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-helder-wander-sousa-de-azevedo-costa', 'petro', 'HÉLDER WANDER SOUSA DE AZEVEDO COSTA', 'Avançado', 11, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-lucas-eduardo-dos-santos-joao', 'petro', 'LUCAS EDUARDO DOS SANTOS JOÃO', 'Avançado', 9, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-deybi-aldair-flores-flores', 'petro', 'DEYBI ALDAIR FLORES FLORES', 'Médio', 12, 30, 'Honduras', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-hugo-miguel-barreto-henriques-marques', 'petro', 'HUGO MIGUEL BARRETO HENRIQUES MARQUES', 'Guarda-redes', 1, 40, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-antonio-da-silva-chitanga-hossi', 'petro', 'Antonio da Silva Chitanga Hossi', 'Defesa', 27, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-tiago-lima-leal', 'petro', 'TIAGO LIMA LEAL', 'Avançado', 26, 38, 'Brasil', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-laurindo-dilson-maria-aurelio', 'petro', 'LAURINDO DILSON MARIA AURÉLIO', 'Avançado', 29, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-nurio-domingos-matias-fortuna', 'petro', 'NURIO DOMINGOS MATIAS FORTUNA', 'Médio', 2, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-eddie-marcos-melo-afonso', 'petro', 'EDDIE MARCOS MELO AFONSO', 'Defesa', 25, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-victor-pedro-nanque', 'petro', 'VICTOR PEDRO NANQUE', 'Defesa', 18, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-pedro-miguel-santos-aparicio', 'petro', 'PEDRO MIGUEL SANTOS APARÍCIO', 'Avançado', 10, 31, 'Portugal', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('petro-vanilson-tita-zeu', 'petro', 'VANILSON TITA ZÉU', 'Médio', 17, 27, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

-- FC Cabinda (cabinda) — 28 jogadores
delete from public.ancaf_players where team_id = 'cabinda';
insert into public.ancaf_players
  (id, team_id, name, position, jersey_number, age, nationality,
   goals, assists, appearances, attributes, career_history, fifa_connect_status)
values
  ('cabinda-ariclenis-afonso-araujo-lede', 'cabinda', 'Ariclenis Afonso Araújo Lede', 'Avançado', 29, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-cornelio-queba-lelo-baptista', 'cabinda', 'CORNELIO QUEBA LELO BAPTISTA', 'Médio', 15, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-fernando-matombe-bazonga', 'cabinda', 'FERNANDO MATOMBE BAZONGA', 'Médio', 21, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-mario-antonio-bumba', 'cabinda', 'MARIO ANTONIO BUMBA', 'Defesa', 6, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-francisco-domingas-chicapa', 'cabinda', 'FRANCISCO DOMINGAS CHICAPA', 'Guarda-redes', 12, 23, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-costa-miguel-domingos-titi', 'cabinda', 'Costa Miguel Domingos Titi', 'Avançado', 7, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-marcos-lando', 'cabinda', 'Marcos Lando', 'Defesa', 5, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-cristiano-malonda', 'cabinda', 'Cristiano Malonda', 'Médio', 8, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-jaime-da-graca-malonda-buange', 'cabinda', 'JAIME DA GRACA MALONDA BUANGE', 'Médio', 26, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-gedeon-macosso-mananga', 'cabinda', 'Gedeon Macosso Mananga', 'Avançado', 3, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-julio-mavungo-andre', 'cabinda', 'Júlio Mavungo André', 'Defesa', 17, 24, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-antonio-makiobo-mbungo', 'cabinda', 'António Makiobo Mbungo', 'Defesa', 16, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-frederico-zau', 'cabinda', 'FREDERICO ZAU', 'Defesa', 20, 29, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-rodrigo-dos-santos-ngimbi', 'cabinda', 'Rodrigo dos Santos Ngimbi', 'Defesa', 2, 31, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-arsenio-muanda', 'cabinda', 'ARSENIO MUANDA', 'Guarda-redes', 31, 22, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-jose-pitra-ieze-manteiga', 'cabinda', 'Jose Pitra Ieze Manteiga', 'Avançado', 18, 32, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-jose-espanhol-cardoso-bras', 'cabinda', 'JOSÉ ESPANHOL CARDOSO BRÁS', 'Médio', 23, 28, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-luis-liberal-lemos-casimiro-casimiro', 'cabinda', 'Luís Liberal Lemos Casimiro Casimiro', 'Defesa', 27, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-joao-cambo', 'cabinda', 'João Cambo', 'Defesa', 25, 33, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-rodilson-sumbo-da-costa', 'cabinda', 'Rodilson sumbo Da Costa', 'Médio', 10, 18, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-pedro-da-silva-da-silva', 'cabinda', 'Pedro da Silva Da Silva', 'Avançado', 30, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-joao-eduardo', 'cabinda', 'JOÃO EDUARDO', 'Guarda-redes', 1, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-simao-gomes', 'cabinda', 'Simão Gomes', 'Avançado', 14, 21, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-antonio-kapata', 'cabinda', 'António Kapata', 'Avançado', 9, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-francisco-luemba', 'cabinda', 'Francisco Luemba', 'Defesa', 4, 26, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-mario-chiwale-caluaco-da-silva-mario', 'cabinda', 'Mário Chiwale Caluaco da Silva Mário', 'Médio', 24, 25, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-domingos-paixao-paulino-lourenco', 'cabinda', 'DOMINGOS PAIXÃO PAULINO LOURENÇO', 'Médio', 19, 19, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active'),
  ('cabinda-luyeye-tomas-tomas', 'cabinda', 'LUYEYE TOMÁS TOMÁS', 'Médio', 13, 34, 'Angola', 0, 0, 0, '{}'::jsonb, '[]'::jsonb, 'active')
on conflict (id) do update set
  team_id = excluded.team_id,
  name = excluded.name,
  position = excluded.position,
  jersey_number = excluded.jersey_number,
  age = excluded.age,
  nationality = excluded.nationality,
  fifa_connect_status = excluded.fifa_connect_status;

commit;
-- Total: 514 jogadores em 16 clubes.
