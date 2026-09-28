-- Atualização idempotente do plantel Wiliete 2026/27.
update public.ancaf_players set registered_squad=false, jersey_number=0 where team_id='wiliete' and (ma_id in ('006986M07','008139M08','008136M07') or id='kabelo-dlamini');
update public.ancaf_players set name='Nelo',full_name='João Valonga Basilio Barros',position='Defesa',jersey_number=26,birth_date='2002-02-21',nationality='Angola',ma_id='000647M02',fifa_connect_id='1JZ4N21',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jz4n21' or (team_id='wiliete' and ma_id='000647M02');
update public.ancaf_players set name='Balsa',full_name='Augusto Manuel Balsa',position='Defesa',jersey_number=15,birth_date='2000-05-06',nationality='Angola',ma_id='000320M00',fifa_connect_id='1JJFIJ0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jjfij0' or (team_id='wiliete' and ma_id='000320M00');
update public.ancaf_players set name='Silva',full_name='Silva Hinário António',position='Defesa',jersey_number=3,birth_date='1998-02-10',nationality='Angola',ma_id='002281M98',fifa_connect_id='1LJZ6E0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1ljz6e0' or (team_id='wiliete' and ma_id='002281M98');
update public.ancaf_players set name='Bello',full_name='Lukman Idowu Bello',position='Avançado',jersey_number=18,birth_date='2002-10-03',nationality='RD Congo',ma_id='007235M02',fifa_connect_id='1SN8AC3',registered_squad=true,updated_at=timezone('utc',now()) where id='bello-lukman-wiliete' or (team_id='wiliete' and ma_id='007235M02');
update public.ancaf_players set name='Mindinho',full_name='Armindo Gonçalves Canji',position='Médio',jersey_number=10,birth_date='2004-10-18',nationality='Angola',ma_id='000401M04',fifa_connect_id='1JRU7C5',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jru7c5' or (team_id='wiliete' and ma_id='000401M04');
update public.ancaf_players set name='Igui',full_name='Carlos Cassissi',position='Médio',jersey_number=24,birth_date='2006-05-03',nationality='Angola',ma_id='008144M06',fifa_connect_id='1UQNV32',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1uqnv32' or (team_id='wiliete' and ma_id='008144M06');
update public.ancaf_players set name='Giovani',full_name='Giovani Chipopolo',position='Defesa',jersey_number=17,birth_date='1999-10-03',nationality='Angola',ma_id='000544M99',fifa_connect_id='1JWU6Z0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jwu6z0' or (team_id='wiliete' and ma_id='000544M99');
update public.ancaf_players set name='Mule',full_name='António Mule Chitongo',position='Médio',jersey_number=8,birth_date='1999-06-08',nationality='Angola',ma_id='001123M99',fifa_connect_id='1K39NK6',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1k39nk6' or (team_id='wiliete' and ma_id='001123M99');
update public.ancaf_players set name='Macaiabo',full_name='Francisco Cubuema Matoco',position='Médio',jersey_number=16,birth_date='2000-02-14',nationality='Angola',ma_id='000888M00',fifa_connect_id='1K1JSJ8',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1k1jsj8' or (team_id='wiliete' and ma_id='000888M00');
update public.ancaf_players set name='Elber',full_name='Elber Delgado',position='Guarda-redes',jersey_number=31,birth_date='1991-06-24',nationality='Cabo Verde',ma_id='000325M91',fifa_connect_id='1JM7Y97',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jm7y97' or (team_id='wiliete' and ma_id='000325M91');
update public.ancaf_players set name='Filó',full_name='Filomeno Pinheiro Alberto Giloso',position='Avançado',jersey_number=21,birth_date='2005-07-27',nationality='Angola',ma_id='003650M05',fifa_connect_id='1NI87H8',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1ni87h8' or (team_id='wiliete' and ma_id='003650M05');
update public.ancaf_players set name='Nayan',full_name='Nayan Gomes',position='Guarda-redes',jersey_number=1,birth_date='1999-12-11',nationality='Brasil',ma_id='004505M99',fifa_connect_id='1PKWT84',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1pkwt84' or (team_id='wiliete' and ma_id='004505M99');
update public.ancaf_players set name='César Cangué',full_name='Cesar Cangui Uvi Jeremias',position='Avançado',jersey_number=34,birth_date='2003-05-03',nationality='Angola',ma_id='001110M03',fifa_connect_id='1K36HF0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1k36hf0' or (team_id='wiliete' and ma_id='001110M03');
update public.ancaf_players set name='Ning',full_name='Rodino Dumbo José',position='Avançado',jersey_number=25,birth_date='1995-09-20',nationality='Angola',ma_id='000540M95',fifa_connect_id='1JWU0L8',registered_squad=true,updated_at=timezone('utc',now()) where id='ning-wiliete' or (team_id='wiliete' and ma_id='000540M95');
update public.ancaf_players set name='Júnior Goiano',full_name='Emanoel Júnior',position='Defesa',jersey_number=27,birth_date='1998-03-14',nationality='Brasil',ma_id='004709M98',fifa_connect_id='1PNMJ53',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1pnmj53' or (team_id='wiliete' and ma_id='004709M98');
update public.ancaf_players set name='Kaká',full_name='Daniel Artur Kaká',position='Médio',jersey_number=19,birth_date='2003-09-11',nationality='Angola',ma_id='001293M03',fifa_connect_id='1L05V38',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1l05v38' or (team_id='wiliete' and ma_id='001293M03');
update public.ancaf_players set name='Wiwi',full_name='Arão Manuel Lologi',position='Defesa',jersey_number=5,birth_date='1993-09-06',nationality='Angola',ma_id='000461M93',fifa_connect_id='1JSRPL0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jsrpl0' or (team_id='wiliete' and ma_id='000461M93');
update public.ancaf_players set name='Quare',full_name='Zeferino Venancio Lussati',position='Avançado',jersey_number=33,birth_date='1999-06-26',nationality='Angola',ma_id='001233M99',fifa_connect_id='1KZR1V5',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1kzr1v5' or (team_id='wiliete' and ma_id='001233M99');
update public.ancaf_players set name='Walter Monteiro',full_name='Valter Manuel Monteiro',position='Médio',jersey_number=35,birth_date='2005-12-31',nationality='Angola',ma_id='000412M05',fifa_connect_id='1JRV1H9',registered_squad=true,updated_at=timezone('utc',now()) where id='valter-monteiro' or (team_id='wiliete' and ma_id='000412M05');
update public.ancaf_players set name='Guilherme',full_name='Guilherme Neto',position='Defesa',jersey_number=4,birth_date='1993-10-09',nationality='Brasil',ma_id='005349M93',fifa_connect_id='1PU18X2',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1pu18x2' or (team_id='wiliete' and ma_id='005349M93');
update public.ancaf_players set name='Bito',full_name='Camilo Mbule Ngongue',position='Médio',jersey_number=28,birth_date='2001-12-07',nationality='Angola',ma_id='000417M01',fifa_connect_id='1JRXS05',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jrxs05' or (team_id='wiliete' and ma_id='000417M01');
update public.ancaf_players set name='Mabululu',full_name='Cristovão Paciência',position='Avançado',jersey_number=9,birth_date='1992-06-01',nationality='Angola',ma_id='008897M92',fifa_connect_id='1UXFL56',registered_squad=true,updated_at=timezone('utc',now()) where id='mabululu-wiliete' or (team_id='wiliete' and ma_id='008897M92');
update public.ancaf_players set name='Karanga',full_name='Jorge Mendes Corte Real Carneiro',position='Médio',jersey_number=7,birth_date='1992-02-19',nationality='Angola',ma_id='000448M92',fifa_connect_id='1JSJBH0',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jsjbh0' or (team_id='wiliete' and ma_id='000448M92');
update public.ancaf_players set name='Benny',full_name='Teodoro Edvaldo Rita Tchissingui',position='Guarda-redes',jersey_number=12,birth_date='2000-02-20',nationality='Angola',ma_id='000391M00',fifa_connect_id='1JRTUE9',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jrtue9' or (team_id='wiliete' and ma_id='000391M00');
update public.ancaf_players set name='Sidibé',full_name='Bocar Sidibé',position='Médio',jersey_number=30,birth_date='2004-01-26',nationality='Mali',ma_id='006176M04',fifa_connect_id='1QVFJM7',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1qvfjm7' or (team_id='wiliete' and ma_id='006176M04');
update public.ancaf_players set name='Yano',full_name='Adriano Watchilala Tchombe',position='Defesa',jersey_number=13,birth_date='2006-03-22',nationality='Angola',ma_id='005385M06',fifa_connect_id='1PVXHT8',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1pvxht8' or (team_id='wiliete' and ma_id='005385M06');
update public.ancaf_players set name='Gibelé',full_name='Deivi Miguel Vieira',position='Avançado',jersey_number=11,birth_date='2001-03-10',nationality='Angola',ma_id='000445M01',fifa_connect_id='1JSJ8T3',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1jsj8t3' or (team_id='wiliete' and ma_id='000445M01');
update public.ancaf_players set name='Célio',full_name='Célio Alberto Junqueira Zua',position='Médio',jersey_number=32,birth_date='2003-07-15',nationality='Angola',ma_id='002755M03',fifa_connect_id='1M95S64',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1m95s64' or (team_id='wiliete' and ma_id='002755M03');
update public.ancaf_players set name='Didi Craque',full_name='Eduardo António Henrique Capingana',position='Médio',jersey_number=2,birth_date='1998-07-15',nationality='Angola',ma_id='003548M98',fifa_connect_id='1NDEMR2',registered_squad=true,updated_at=timezone('utc',now()) where id='fifa-1ndemr2' or (team_id='wiliete' and ma_id='003548M98');
insert into public.ancaf_players (id,team_id,club,name,full_name,position,jersey_number,birth_date,nationality,height,ma_id,gender,fifa_connect_id,fifa_connect_status,registered_squad) values ('janderson-wiliete','wiliete','Wiliete de Benguela','Janderson','Janderson de Oliveira Maia','Médio',6,'1994-01-14','Brasil','1.80m','008898M94','MALE','1JAND06','active',true) on conflict (id) do nothing;
update public.ancaf_players set name='Janderson',full_name='Janderson de Oliveira Maia',position='Médio',jersey_number=6,birth_date='1994-01-14',nationality='Brasil',ma_id='008898M94',fifa_connect_id='1JAND06',registered_squad=true,updated_at=timezone('utc',now()) where id='janderson-wiliete' or (team_id='wiliete' and ma_id='008898M94');
update public.ancaf_players set registered_squad=false,jersey_number=0 where id='fifa-1jwu0l8' and team_id='wiliete';
-- girabola_players/girabola_clubs são o espelho FCMS e só existem no Supabase.
-- No Neon a tabela não está instalada, por isso o bloco é aplicado condicionalmente.
do $guard$
begin
  if to_regclass('public.girabola_players') is not null then
    execute $sql$
insert into public.girabola_players
  (id, club_id, name, full_name, popular_name, ma_id, fifa_id, gender, birth_date, nationality, position, jersey_number)
values
  ('000647M02', 'wiliete', 'Nelo', 'João Valonga Basilio Barros', 'Nelo', '000647M02', '1JZ4N21', 'MALE', '2002-02-21', 'Angola', 'DF', 26),
  ('000320M00', 'wiliete', 'Balsa', 'Augusto Manuel Balsa', 'Balsa', '000320M00', '1JJFIJ0', 'MALE', '2000-05-06', 'Angola', 'DF', 15),
  ('002281M98', 'wiliete', 'Silva', 'Silva Hinário António', 'Silva', '002281M98', '1LJZ6E0', 'MALE', '1998-02-10', 'Angola', 'DF', 3),
  ('007235M02', 'wiliete', 'Bello', 'Lukman Idowu Bello', 'Bello', '007235M02', '1SN8AC3', 'MALE', '2002-10-03', 'Democratic Republic of the Congo', 'FWD', 18),
  ('000401M04', 'wiliete', 'Mindinho', 'Armindo Gonçalves Canji', 'Mindinho', '000401M04', '1JRU7C5', 'MALE', '2004-10-18', 'Angola', 'MF', 10),
  ('008144M06', 'wiliete', 'Igui', 'Carlos Cassissi', 'Igui', '008144M06', '1UQNV32', 'MALE', '2006-05-03', 'Angola', 'MF', 24),
  ('000544M99', 'wiliete', 'Giovani', 'Giovani Chipopolo', 'Giovani', '000544M99', '1JWU6Z0', 'MALE', '1999-10-03', 'Angola', 'DF', 17),
  ('001123M99', 'wiliete', 'Mule', 'António Mule Chitongo', 'Mule', '001123M99', '1K39NK6', 'MALE', '1999-06-08', 'Angola', 'MF', 8),
  ('000888M00', 'wiliete', 'Macaiabo', 'Francisco Cubuema Matoco', 'Macaiabo', '000888M00', '1K1JSJ8', 'MALE', '2000-02-14', 'Angola', 'MF', 16),
  ('000325M91', 'wiliete', 'Elber', 'Elber Delgado', 'Elber', '000325M91', '1JM7Y97', 'MALE', '1991-06-24', 'Cabo Verde', 'GK', 31),
  ('003650M05', 'wiliete', 'Filó', 'Filomeno Pinheiro Alberto Giloso', 'Filó', '003650M05', '1NI87H8', 'MALE', '2005-07-27', 'Angola', 'FWD', 21),
  ('004505M99', 'wiliete', 'Nayan', 'Nayan Gomes', 'Nayan', '004505M99', '1PKWT84', 'MALE', '1999-12-11', 'Brazil', 'GK', 1),
  ('001110M03', 'wiliete', 'César Cangué', 'Cesar Cangui Uvi Jeremias', 'César Cangué', '001110M03', '1K36HF0', 'MALE', '2003-05-03', 'Angola', 'FWD', 34),
  ('000540M95', 'wiliete', 'Ning', 'Rodino Dumbo José', 'Ning', '000540M95', '1JWU0L8', 'MALE', '1995-09-20', 'Angola', 'FWD', 25),
  ('004709M98', 'wiliete', 'Júnior Goiano', 'Emanoel Júnior', 'Júnior Goiano', '004709M98', '1PNMJ53', 'MALE', '1998-03-14', 'Brazil', 'DF', 27),
  ('001293M03', 'wiliete', 'Kaká', 'Daniel Artur Kaká', 'Kaká', '001293M03', '1L05V38', 'MALE', '2003-09-11', 'Angola', 'MF', 19),
  ('006986M07', 'wiliete', 'António Manuel Victorino Kulica', 'António Manuel Victorino Kulica', null, '006986M07', '1SCQY89', 'MALE', '2007-05-21', 'Angola', 'MF', null),
  ('000461M93', 'wiliete', 'Wiwi', 'Arão Manuel Lologi', 'Wiwi', '000461M93', '1JSRPL0', 'MALE', '1993-09-06', 'Angola', 'DF', 5),
  ('001233M99', 'wiliete', 'Quare', 'Zeferino Venancio Lussati', 'Quare', '001233M99', '1KZR1V5', 'MALE', '1999-06-26', 'Angola', 'FWD', 33),
  ('000412M05', 'wiliete', 'Walter Monteiro', 'Valter Manuel Monteiro', 'Walter Monteiro', '000412M05', '1JRV1H9', 'MALE', '2005-12-31', 'Angola', 'MF', 35),
  ('005349M93', 'wiliete', 'Guilherme', 'Guilherme Neto', 'Guilherme', '005349M93', '1PU18X2', 'MALE', '1993-10-09', 'Brazil', 'DF', 4),
  ('000417M01', 'wiliete', 'Bito', 'Camilo Mbule Ngongue', 'Bito', '000417M01', '1JRXS05', 'MALE', '2001-12-07', 'Angola', 'MF', 28),
  ('008897M92', 'wiliete', 'Mabululu', 'Cristovão Paciência', 'Mabululu', '008897M92', '1UXFL56', 'MALE', '1992-06-01', 'Angola', 'FWD', 9),
  ('000448M92', 'wiliete', 'Karanga', 'Jorge Mendes Corte Real Carneiro', 'Karanga', '000448M92', '1JSJBH0', 'MALE', '1992-02-19', 'Angola', 'MF', 7),
  ('000391M00', 'wiliete', 'Benny', 'Teodoro Edvaldo Rita Tchissingui', 'Benny', '000391M00', '1JRTUE9', 'MALE', '2000-02-20', 'Angola', 'GK', 12),
  ('006176M04', 'wiliete', 'Sidibé', 'Bocar Sidibé', 'Sidibé', '006176M04', '1QVFJM7', 'MALE', '2004-01-26', 'Mali', 'MF', 30),
  ('008139M08', 'wiliete', 'Adenilson Paulo Tchingando', 'Adenilson Paulo Tchingando', null, '008139M08', '1UQNTJ4', 'MALE', '2008-02-05', 'Angola', 'DF', null),
  ('005385M06', 'wiliete', 'Yano', 'Adriano Watchilala Tchombe', 'Yano', '005385M06', '1PVXHT8', 'MALE', '2006-03-22', 'Angola', 'DF', 13),
  ('000445M01', 'wiliete', 'Gibelé', 'Deivi Miguel Vieira', 'Gibelé', '000445M01', '1JSJ8T3', 'MALE', '2001-03-10', 'Angola', 'FWD', 11),
  ('002755M03', 'wiliete', 'Célio', 'Célio Alberto Junqueira Zua', 'Célio', '002755M03', '1M95S64', 'MALE', '2003-07-15', 'Angola', 'MF', 32),
  ('008136M07', 'wiliete', 'Abel Samandi Mbambi', 'Abel Samandi Mbambi', null, '008136M07', '1UQNSL6', 'MALE', '2007-07-26', 'Angola', 'GK', null),
  ('003548M98', 'wiliete', 'Didi Craque', 'Eduardo António Henrique Capingana', 'Didi Craque', '003548M98', '1NDEMR2', 'MALE', '1998-07-15', 'Angola', 'MF', 2),
  ('008898M94', 'wiliete', 'Janderson', 'Janderson de Oliveira Maia', 'Janderson', '008898M94', '1JAND06', 'MALE', '1994-01-14', 'Brazil', 'MF', 6)
on conflict (id) do update set name=excluded.name,full_name=excluded.full_name,popular_name=excluded.popular_name,fifa_id=excluded.fifa_id,birth_date=excluded.birth_date,nationality=excluded.nationality,position=excluded.position,jersey_number=excluded.jersey_number,updated_at=timezone('utc',now());
    $sql$;
  end if;
end
$guard$;
