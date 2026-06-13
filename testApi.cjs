async function test() {
  try {
    const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.theverge.com/rss/index.xml');
    const data = await res.json();
    console.log(JSON.stringify(data.items.slice(0, 2), null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
