-- Correções confirmadas pelo onze oficial do Desportivo da Lunda Sul,
-- publicado antes do jogo da 1.ª jornada frente ao Petro de Luanda.

update public.ancaf_players
set name = 'Fredy', jersey_number = 5
where id = 'fred' and team_id = 'lundasul';

update public.ancaf_players
set name = 'Platiny', jersey_number = 6
where id = 'platini' and team_id = 'lundasul';

update public.ancaf_players
set name = 'Kacusso', jersey_number = 12
where id = 'cacusso' and team_id = 'lundasul';

update public.ancaf_players
set jersey_number = 35
where id = 'fuca' and team_id = 'lundasul';

update public.ancaf_matches
set referee = 'Miguel Tchissingu Augusto Américo',
    assistant_referees = jsonb_build_array(
      'João Manuel Fula António',
      'Nery Domingos Pereira Amador da Silva'
    ),
    fourth_official = 'Isaías Justino Camaxi'
where round = 1 and home_team_id = 'lundasul' and away_team_id = 'petro';
