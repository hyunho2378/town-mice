// 원본 CertificateCard의 정렬, 구획선, 인장 구조를 감열지 영수증으로 재설계한다.
// 모든 상호, 거래, 주소는 시연용이다. 실제 결제 증빙으로 사용할 수 없다.
function receiptSvg(sample) {
  const d = receiptDesign;
  const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const txt = (x,y,value,size=d.body,weight=500,anchor='start',color=d.ink) => '<text x="'+x+'" y="'+y+'" font-size="'+size+'" font-weight="'+weight+'" text-anchor="'+anchor+'" fill="'+color+'">'+esc(value)+'</text>';
  const line = (y) => '<path d="M32 '+y+'H368" stroke="'+d.rule+'" stroke-dasharray="4 4"/>';
  const detail = sample.category === 'stay' ? ['객실 1실 / 2박', '200,000 × 2', '강원특별자치도 화천군 하남면'] : sample.category === 'restaurant' ? ['식사 세트 / 3인', '15,000 × 3', '강원특별자치도 화천군 화천읍'] : ['지역 농산물 / 2상자', '16,000 × 2', '강원특별자치도 화천군 간동면'];
  const number = sample.id === 'sample-stay' ? '01' : sample.id === 'sample-restaurant' ? '02' : '03';
  let s = '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="680" viewBox="0 0 400 680" role="img"><title>'+esc(sample.label)+' 시연용 영수증</title><g font-family="Pretendard, Apple SD Gothic Neo, sans-serif">';
  s += '<path fill="'+d.paper+'" d="M0 0H400V668'+Array.from({length:25},(_,i)=>'l-8 8 -8 -8').join('')+'Z"/>';
  s += txt(200,36,'TOWN MICE / DEMO RECEIPT',d.small,700,'middle',d.muted);
  s += txt(200,79,sample.merchant,d.title,800,'middle');
  s += txt(200,107,'거래 영수증',d.body,600,'middle');
  s += '<rect x="120" y="124" width="160" height="26" rx="3" fill="none" stroke="'+d.stamp+'"/>' + txt(200,142,'시연용 / 결제 효력 없음',d.small,700,'middle',d.stamp);
  s += line(172) + txt(32,198,'거래번호',d.small,500,'start',d.muted) + txt(368,198,'DEMO-HC-'+number,d.body,600,'end');
  s += txt(32,224,'결제일시',d.small,500,'start',d.muted) + txt(368,224,'2027.01.16 14:32',d.body,600,'end');
  s += txt(32,250,'가맹점 주소 (가상)',d.small,500,'start',d.muted) + txt(32,276,detail[2]);
  s += txt(32,299,'상세주소 및 사업자번호는 시연에서 생략',d.small,500,'start',d.muted) + line(318);
  s += txt(32,344,'품목 / 수량',d.small,600,'start',d.muted) + txt(368,344,'금액',d.small,600,'end',d.muted);
  s += txt(32,375,detail[0],d.body,700) + txt(368,375,sample.amount.toLocaleString('ko-KR'),d.body,700,'end');
  s += txt(32,398,detail[1],d.small,500,'start',d.muted) + line(421);
  s += txt(32,457,'합계',d.body,800) + txt(368,460,sample.amount.toLocaleString('ko-KR')+'원',d.total,800,'end');
  s += txt(32,491,'결제수단',d.small,500,'start',d.muted) + txt(368,491,'카드 결제 (시뮬레이션)',d.body,500,'end');
  s += line(514);
  s += '<g transform="translate(289 534) rotate(-7 32 25)"><rect width="68" height="48" rx="3" fill="none" stroke="'+d.stamp+'" stroke-width="2"/>'+txt(34,20,'시연용',d.body,800,'middle',d.stamp)+txt(34,37,'SAMPLE',d.small,700,'middle',d.stamp)+'</g>';
  s += txt(32,546,'겨울 영수증, 여름 화천',d.body,700) + txt(32,568,'영수증은 버리지 마세요.',d.small,500,'start',d.muted);
  s += txt(200,616,'상호와 거래 내역은 모두 가상입니다.',d.small,600,'middle',d.muted) + txt(200,636,'실제 결제, 세무, 환급 증빙으로 사용할 수 없습니다.',d.small,500,'middle',d.muted);
  return s+'</g></svg>';
}
function ReceiptImage({ sample, className = '' }) {
  return <img src={'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(receiptSvg(sample))} alt={sample.label+' '+sample.amount.toLocaleString('ko-KR')+'원 시연용 영수증'} className={'block w-full h-auto '+className} />;
}
