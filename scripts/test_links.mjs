// Script para testar todos os links de presença digital dos 16 clubes
// Verifica: HTTP status, redirecionamentos, e se a URL final é diferente da esperada

const LINKS = [
  // Petro de Luanda
  { clube: 'Petro de Luanda', tipo: 'website', url: 'https://petroatletico.co.ao/' },
  { clube: 'Petro de Luanda', tipo: 'facebook', url: 'https://www.facebook.com/atleticopetroleosluanda' },
  { clube: 'Petro de Luanda', tipo: 'instagram', url: 'https://www.instagram.com/petro_de_luanda_oficial/' },
  { clube: 'Petro de Luanda', tipo: 'youtube', url: 'https://www.youtube.com/@petrodeluandaoficial' },

  // 1º de Agosto
  { clube: '1.º de Agosto', tipo: 'website', url: 'https://www.1agosto.com/' },
  { clube: '1.º de Agosto', tipo: 'facebook', url: 'https://www.facebook.com/clube1deagosto/' },
  { clube: '1.º de Agosto', tipo: 'instagram', url: 'https://www.instagram.com/cdagosto/' },

  // Sagrada Esperança
  { clube: 'Sagrada Esperança', tipo: 'website', url: 'https://gdse.ao/' },
  { clube: 'Sagrada Esperança', tipo: 'facebook', url: 'https://www.facebook.com/cdsagradaesperanca' },
  { clube: 'Sagrada Esperança', tipo: 'instagram', url: 'https://www.instagram.com/cdsagradaesperanca/' },

  // Interclube
  { clube: 'Interclube', tipo: 'website', url: 'http://interclube.co.ao/' },
  { clube: 'Interclube', tipo: 'facebook', url: 'https://www.facebook.com/InterclubeAngolaGDI/' },
  { clube: 'Interclube', tipo: 'instagram', url: 'https://www.instagram.com/gdinterclube/' },

  // Recreativo do Libolo
  { clube: 'Recreativo do Libolo', tipo: 'facebook', url: 'https://www.facebook.com/CRDLibolo/' },
  { clube: 'Recreativo do Libolo', tipo: 'instagram', url: 'https://www.instagram.com/libolo.oficial/' },

  // Wiliete de Benguela
  { clube: 'Wiliete de Benguela', tipo: 'website', url: 'https://wilietesc.ao/' },
  { clube: 'Wiliete de Benguela', tipo: 'facebook', url: 'https://www.facebook.com/WilieteSportClube' },
  { clube: 'Wiliete de Benguela', tipo: 'instagram', url: 'https://www.instagram.com/wilietesc/' },

  // Bravos do Maquis
  { clube: 'Bravos do Maquis', tipo: 'website', url: 'https://bravosdomaquis.co.ao/' },
  { clube: 'Bravos do Maquis', tipo: 'facebook', url: 'https://www.facebook.com/p/Bravos-do-Maquis-do-Moxico-100095414350444/' },
  { clube: 'Bravos do Maquis', tipo: 'instagram', url: 'https://www.instagram.com/bravosdomaquis/' },

  // Desportivo da Huíla
  { clube: 'Desportivo da Huíla', tipo: 'facebook', url: 'https://www.facebook.com/CDhuila/' },
  { clube: 'Desportivo da Huíla', tipo: 'instagram', url: 'https://www.instagram.com/clubedesportivodahuila_/' },

  // Kabuscorp
  { clube: 'Kabuscorp', tipo: 'facebook', url: 'https://www.facebook.com/kabuscorpscp' },
  { clube: 'Kabuscorp', tipo: 'instagram', url: 'https://www.instagram.com/kabuscorp.scp/' },

  // Desportivo da Lunda Sul
  { clube: 'Desportivo da Lunda Sul', tipo: 'facebook', url: 'https://www.facebook.com/p/Clube-Desportivo-Da-Lunda-Sul-100077348542835/' },
  { clube: 'Desportivo da Lunda Sul', tipo: 'instagram', url: 'https://www.instagram.com/clubedesportivodalundasul/' },

  // Académica do Lobito
  { clube: 'Académica do Lobito', tipo: 'facebook', url: 'https://www.facebook.com/academicalobito' },
  { clube: 'Académica do Lobito', tipo: 'instagram', url: 'https://www.instagram.com/academicalobito/' },

  // São Salvador do Kongo
  { clube: 'São Salvador do Kongo', tipo: 'facebook', url: 'https://www.facebook.com/saosalvadordokongo' },
  { clube: 'São Salvador do Kongo', tipo: 'instagram', url: 'https://www.instagram.com/cdsaosalvador/' },

  // CR Caála
  { clube: 'CR Caála', tipo: 'facebook', url: 'https://www.facebook.com/ClubeRecreativodaCaala' },

  // FC Cabinda
  { clube: 'FC Cabinda', tipo: 'website', url: 'https://fccabinda.com/' },
  { clube: 'FC Cabinda', tipo: 'facebook', url: 'https://www.facebook.com/fccabinda' },
  { clube: 'FC Cabinda', tipo: 'instagram', url: 'https://www.instagram.com/fccabinda' },

  // 1.º de Maio
  { clube: '1.º de Maio', tipo: 'facebook', url: 'https://www.facebook.com/EstrelaClub1oDeMaioDeBenguela' },

  // FC Luanda
  { clube: 'FC Luanda', tipo: 'facebook', url: 'https://www.facebook.com/923669860835536' },
  { clube: 'FC Luanda', tipo: 'instagram', url: 'https://www.instagram.com/fcluanda_oficial/' },
];

async function testUrl(entry) {
  const { clube, tipo, url } = entry;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkChecker/1.0)',
      },
    });
    clearTimeout(timeout);

    const finalUrl = res.url;
    const status = res.status;

    // Detect if redirected to a search page
    const isSearchRedirect =
      finalUrl.includes('/search?') ||
      finalUrl.includes('?q=') ||
      finalUrl.includes('/find/') ||
      (tipo === 'facebook' && finalUrl.includes('facebook.com/search')) ||
      (tipo === 'instagram' && finalUrl.includes('instagram.com/explore'));

    const isOk = status >= 200 && status < 400;

    return {
      clube,
      tipo,
      url,
      status,
      finalUrl: finalUrl !== url ? finalUrl : null,
      ok: isOk && !isSearchRedirect,
      isSearchRedirect,
      error: null,
    };
  } catch (err) {
    clearTimeout(timeout);
    return {
      clube,
      tipo,
      url,
      status: null,
      finalUrl: null,
      ok: false,
      isSearchRedirect: false,
      error: err.name === 'AbortError' ? 'TIMEOUT (>10s)' : err.message,
    };
  }
}

async function main() {
  console.log(`\n🔍 Testando ${LINKS.length} links de presença digital dos 16 clubes...\n`);
  console.log('='.repeat(80));

  const results = [];

  // Test sequentially to avoid rate limiting
  for (const entry of LINKS) {
    process.stdout.write(`  [${entry.tipo.padEnd(9)}] ${entry.clube.padEnd(30)} → `);
    const result = await testUrl(entry);
    results.push(result);

    if (result.ok) {
      const redirect = result.finalUrl ? ` (→ ${result.finalUrl.substring(0, 60)})` : '';
      console.log(`✅ ${result.status}${redirect}`);
    } else if (result.isSearchRedirect) {
      console.log(`⚠️  SEARCH REDIRECT → ${result.finalUrl}`);
    } else if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else {
      console.log(`❌ HTTP ${result.status} - ${result.finalUrl || result.url}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMO FINAL\n');

  const passed = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  const searchRedirects = results.filter(r => r.isSearchRedirect);
  const errors = results.filter(r => r.error && !r.isSearchRedirect);

  console.log(`  ✅ Links OK:               ${passed.length}/${results.length}`);
  console.log(`  ⚠️  Redirecionam p/ pesquisa: ${searchRedirects.length}`);
  console.log(`  ❌ Erros/Inacessíveis:      ${errors.length}`);

  if (failed.length > 0) {
    console.log('\n🚨 LINKS COM PROBLEMAS:\n');
    for (const r of failed) {
      console.log(`  • [${r.tipo}] ${r.clube}`);
      console.log(`    URL: ${r.url}`);
      if (r.isSearchRedirect) console.log(`    ⚠️  Redireciona para pesquisa: ${r.finalUrl}`);
      if (r.error) console.log(`    ❌ Erro: ${r.error}`);
      if (!r.error && !r.isSearchRedirect) console.log(`    ❌ HTTP Status: ${r.status}`);
      console.log();
    }
  } else {
    console.log('\n🎉 Todos os links estão funcionais e apontam diretamente para as páginas dos clubes!');
  }

  console.log('='.repeat(80) + '\n');

  // Exit with error code if any failed
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
