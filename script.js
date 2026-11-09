(function(){
'use strict';
var d=document;
if(d.getElementById('m-ui')){
    var p=d.getElementById('m-ui');
    p.style.display=p.style.display==='none'?'flex':'none';
    return;
}
var ls=localStorage,
    savedThm=ls.getItem('y_hud_theme')||'black_red',
    savedIcn=ls.getItem('y_hud_icon')||'akatsuki',
    savedFnt=ls.getItem('y_hud_font')||'cyber',
    savedTxtClr=ls.getItem('y_hud_tclr')||'#f1f5f9',
    savedBg=ls.getItem('y_hud_c_bg')||'#08060f',
    savedBdr=ls.getItem('y_hud_c_bdr')||'#dc2626';

var fontLinks={
    cyber:'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap',
    old:'https://fonts.googleapis.com/css2?family=VT323&display=swap',
    common:'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
    signature:'https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap',
    cloister:'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap'
};
var fontFamilies={
    cyber:"'Orbitron', monospace",
    old:"'VT323', monospace",
    common:"'Inter', sans-serif",
    signature:"'Caveat', cursive",
    cloister:"'UnifrakturMaguntia', cursive"
};
var fontSizes={cyber:'10.5px',old:'15px',common:'12px',signature:'16px',cloister:'14px'};
var fL=d.createElement('link');
fL.id='m-custom-font';
fL.rel='stylesheet';
fL.href=fontLinks[savedFnt]||fontLinks.cyber;
d.head.appendChild(fL);

var D={
    "$RF":"Reparo Físico",
    "$RR":"Reparo Rápido",
    "$SA":"Serviço Adicional",
    "$AG":" Agendado de acordo com a disponibilidade do cliente.",
    "$DC":"fez contato e durante o atendimento ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.",
    "$LT":"fez contato para relatar lentidão em sua conexão. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. "
};

var rawD=[
    ["Desconexão Chat","Inatividade Chat",0,"$RF","$DC","Desconexão Chat"],
    ["Desconexão Chat - Internet","Desconexão Chat",0,"$RF","cliente fez contato para relatar problema em sua conexão a internet. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.","Desconexão Chat"],
    ["Desconexão Chat - Telefone fixo","Desconexão Chat",0,"$RF","fez contato para relatar problema em seu telefone fixo. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.","Desconexão Chat"],
    ["Desconexão Chat - BrisaTV","Desconexão Chat",0,"$RF","fez contato para relatar problema em seu serviço de TV. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.","Desconexão Chat"],
    ["LIGAÇÃO CAIU - Padrão","Ligação caiu",0,"$RR","Próprio titular. Entrou em contato com o número x informando estar com problemas no serviço. Antes de qualquer tratativa a ligação caiu, foi realizado contato sem êxito.","Ligação caiu"],
    ["LIGAÇÃO CAIU - Lentidão","Ligação caiu",0,"$RR","Próprio titular. Entrou em contato com o número x informando estar com problemas de lentidão. Antes de qualquer tratativa a ligação caiu, foi realizado contato sem êxito.","Ligação caiu"],
    ["LIGAÇÃO CAIU - Sem Acesso","Ligação caiu",0,"$RR","Próprio titular. Entrou em contato com o número x relatando estar sem acesso. Antes de qualquer tratativa a ligação caiu, foi realizado contato sem êxito.","Ligação caiu"],
    ["LIGAÇÃO CAIU - Quedas","Ligação caiu",0,"$RR","Próprio titular. Entrou em contato com o número x relatando quedas de conexão. Antes de qualquer tratativa a ligação caiu, foi realizado contato sem êxito.","Ligação caiu"],
    ["Rota Inoperante","Rota Inoperante - FTTH",0,"$RF","Fez contato para relatar a ausência de acesso. Foi explicado a ele que, naquele momento, a falta de acesso se deve a um rompimento de cabo de fibra que impactou toda a sua rota. Foi fornecido o prazo estimado pela URA para a regularização da situação. O cliente foi informado e está ciente dos detalhes.","Rota Inoperante - FTTH"],
    ["Suspeita de LOS","Suspeita de LOS",1,"$RF","Relatou a falta de acesso e a presença de um LED vermelho piscando. Ao questionar a possibilidade de incidentes ou remoção de equipamentos, o cliente negou qualquer ocorrência. Após constatar a normalidade da rota, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","los"],
    ["Transferência","Solicitação de dados",0,"$RF","entrou em contato buscando informações ou um serviço que não se enquadrava na competência deste setor. Não houve necessidade de sondagem. Em vista disso, o cliente foi encaminhado ao setor competente para atender à sua demanda.","Solicitação de dados"],
    ["Lentidão - Resolvida","Lentidão - FTTH",0,"$RR","$LT O cliente informou que o acesso foi normalizado.","Lentidão"],
    ["Lentidão - Externo","Lentidão - FTTH",1,"$RR","fez contato para relatar lentidão em sua conexão recorrentemente. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que a princípio o acesso foi normalizado, mas irá continuar realizando testes ao longo do restante do dia e, caso a instabilidade persista, ele irá entrar em contato conosco para que possamos verificar ou providenciar o envio de uma equipe ao local, se necessário.","Lentidão"],
    ["Lentidão - Ficou testando","Lentidão - FTTH",0,"$RR","Cliente relatou lentidão na conexão. Foram realizados procedimentos de otimização da rede, incluindo reinicialização remota dos equipamentos e verificação do sinal. O cliente permaneceu em teste para avaliar a melhoria no acesso. Caso persista a instabilidade, orientamos entrar em contato novamente para novas verificações.","Lentidão"],
    ["Lentidão - Inativo","Lentidão - FTTH",0,"$RF","cliente, entrou em contato informando estar com problemas de lentidão na sua conexão, verificado que o sinal da fibra está normal, perguntei se o problema ocorria em todos os aparelhos, mesmo quando o cliente acessa a rede próximo do roteador, o cliente informou que sim, então foi alterado o canal, ativado roteador e reiniciado manualmente os equipamentos, cliente ficou inativo chamado será encerrado.","Lentidão"],
    ["Lentidão - Recorrente","Lentidão - FTTH",1,"$RR","informa estar enfrentando lentidão. Após verificação, observa-se que o problema afeta todos os dispositivos e se restringe à rede sem fio. Eu menciono a intenção de atualizar a rede, no entanto, o cliente destaca que essa questão é recorrente e deseja que uma equipe externa conduza uma análise, uma vez que já havia contatado previamente sem sucesso. Diante da insatisfação do cliente e da constatação de que se trata de uma situação frequente ainda não atendida localmente, uma Ordem de Serviço (O.S.) vai ser aberta para resolver o problema e garantir a retenção do cliente.$AG","Lentidão"],
    ["Rede sumiu","Instabilidade TP-LINK",0,"$RR","relatou que estava sem conexão com a internet e que o nome da rede Wi-Fi não estava aparecendo. Após realizar algumas alterações na configuração da rede, a conexão foi restabelecida com o nome e senha originais. O usuário confirmou que a internet voltou a funcionar corretamente.","Instabilidade TP-LINK"],
    ["Sem gerencia - Resolvido","Sem acesso TP-LINK",0,"$RR","fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Com base na realização desses passos, foi possível restabelecer o acesso.","Sem acesso TP-LINK"],
    ["Sem gerencia - Externo","Sem acesso TP-LINK",1,"$RR","fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Mesmo após a realização desses passos, não foi possível restabelecer o acesso, dessa forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","Sem acesso TP-LINK"],
    ["PON Piscando - Resolvido","PON piscando - FTTH",0,"$RF","Relata que está enfrentando uma interrupção na sua conexão com a internet. Após indagar sobre a situação do LED PON, o cliente confirma que ele está piscando. Ao constatar que a rota está operante, foram executados os procedimentos padrões conforme documentados nos registros de eventos. Após a execução dessas ações, a conectividade foi restabelecida com êxito.","PON Piscando"],
    ["PON Piscando - Externo","PON piscando - FTTH",1,"$RF","Relata que está enfrentando uma interrupção na sua conexão com a internet. Após questionar sobre a situação do LED PON, o cliente confirma que ele está piscando. Ao constatar que a rota está operante, foram executados os procedimentos padrões conforme documentados nos registros de eventos. O cliente informou que o acesso continua interrompido, desta forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","PON Piscando"],
    ["PON Apagada - Resolvido","PON Apagada",0,"$RR","Entrou em contato informando que os serviços da Brisanet estão sem sinal. Ao ser questionado sobre a ativação da LED PON e a ocorrência de acidentes ou remoção de equipamento, o cliente negou qualquer incidente. Após verificar que a rota está normal, procedeu-se à reconfiguração e reinicialização do modem ONU, além de conectá-lo em outra tomada de energia. O cliente reportou que o acesso foi normalizado.","PON apagada - FTTH"],
    ["PON Apagada - Externo","PON apagada - FTTH",1,"$RR","Entrou em contato relatando uma interrupção em sua conexão com a internet. Após questionar sobre a situação do LED PON, o cliente confirmou que ele está apagado. Ao constatar que a rota está operante, seguimos os procedimentos padrões conforme documentados nos registros de eventos. Adicionalmente, conectamos o equipamento em outra tomada de energia e verificamos o botão 'ON/OFF'. No entanto, o cliente informou que o acesso continua interrompido. Diante dessa situação, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local e resolver o problema.$AG","PON Apagada"],
    ["Fibra Rompida","Cabo da fibra rompido",1,"$RF","Relata que algo rompeu o cabo de fibra fora de sua residência. Não foi necessário realizar alguma sondagem. Foi aberta uma ordem de serviço para resolução do problema e a visita técnica agendada para de acordo com a disponibilidade do cliente.","Cabo da fibra rompido"],
    ["Fibra Baixa","Cabo de fibra baixo/remanejamento - FTTH",1,"$SA","Relata sobre um cabo de fibra solto fora de sua residência, foi aberta uma Ordem de Serviço (OS) para verificação.$AG","Cabo de fibra baixo/remanejamento"],
    ["Fibra Ressecada","Troca de cabo fibra - FTTH",1,"$RF","Relata que o cabo de fibra está ressecado em sua residência, onde ninguém mexeu. O cabo corre o risco de ser roto. Foi aberta uma ordem de serviço para verificar o problema.$AG","Cabo da fibra rompido"],
    ["Remanejamento de Fibra","Cabo de fibra baixo/remanejamento - FTTH",1,"$SA","Relata sobre a necessidade do remanejamento do cabo de fibra, pois, está passando sobre propriedades alheias.$AG","Cabo de fibra baixo/remanejamento"],
    ["Quedas na conexão - Resolvido","Quedas na conexão - FTTH",0,"$RR","$LT O cliente informou que o acesso foi normalizado.","Instabilidade na rede WI-FI"],
    ["Quedas na conexão - Externo","Quedas na conexão - FTTH",1,"$RR","fez contato para relatar quedas de acesso em sua conexão recorrentemente. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que a princípio o acesso foi normalizado, mas irá continuar realizando testes ao longo do restante do dia e, caso a instabilidade persista, ele irá entrar em contato conosco para que possamos verificar ou providenciar o envio de uma equipe ao local, se necessário.","Instabilidade TP-LINK (reparo rápido)"],
    ["Quedas de conexão - Ficou testando","Quedas na conexão - FTTH",0,"$RR","$LT O cliente informou que o acesso continua instável, desta forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","Quedas de conexão - FTTH"],
    ["Sem acesso com sinal - Resolvido","sem Acesso",0,"$RR","fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Com base na realização desses passos, foi possível restabelecer o acesso.","Sem acesso"],
    ["Sem acesso com sinal - Externo","sem Acesso",1,"$RR","fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Mesmo após a realização desses passos, não foi possível restabelecer o acesso, dessa forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","Sem acesso"],
    ["Sinal irregular - externo","Sinal da fibra do cliente irregular - FTTH",1,"$RF","relata sobre falta de acesso à internet, foi constatada irregularidade no sinal da PON. A rota foi verificada e estava dentro dos padrões. Questionado sobre possíveis incidentes ou remoção de equipamentos, o cliente negou qualquer ocorrência. Diante disso, foi gerada uma Ordem de Serviço (OS) para inspeção presencial no local, a ser agendada conforme disponibilidade do cliente.","Sinal irregular Fibra"],
    ["Senha da rede wi-fi incorreta","Alterações nas configurações do Wi-Fi - FTTH",0,"$RF","relata que está sem acesso à internet. Verificamos que a rede Wi-Fi do cliente não conecta, com a mensagem de erro de autenticação. A falha na autenticação pode ter sido causada por uma senha incorreta ou por um problema no roteador. Geramos uma nova senha para o cliente e o acesso foi normalizado.","Alterações nas configurações do Wi-Fi - FTTH"],
    ["Alteração de senha - Resolvido","Alterações nas configurações do Wi-Fi - FTTH",0,"$RF","solicitou a alteração da senha da rede Wi-Fi. Foi explicado que a senha é gerada aleatoriamente e composta por caracteres minúsculos. Senha gerada e cliente com acesso","Alterações nas configurações do Wi-Fi - FTTH"],
    ["Alteração de senha - Inativo","Alterações nas configurações do Wi-Fi - FTTH",0,"$RF","solicitou a alteração da senha da rede Wi-Fi. Foi explicado que a senha é gerada aleatoriamente e composta por caracteres minúsculos. Senha gerada, porém, o cliente ficou sem interagir até o encerramento do atendimento.","Alterações nas configurações do Wi-Fi - FTTH"],
    ["Plano no cabo - Resolvido","Plano não chega o contratado - FTTH",0,"$RR","informou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico na sua PON está dentro dos padrões. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, verificamos a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Após essas verificações, realizamos um teste adicional no velocímetro, e agora a velocidade atingiu o contratado.","Plano não chega o contratado - FTTH"],
    ["Plano no cabo - Externo","Plano não chega o contratado - FTTH",1,"$RR","informou estar enfrentando problemas de instabilidade, já que a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico de sua PON está dentro dos padrões. Executamos os procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, constatamos que a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Apesar dessas verificações, o teste adicional no velocímetro ainda indicou uma velocidade inferior à garantida. Diante disso, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local.$AG","Plano não chega o contratado"],
    ["Plano no cabo - Ficou testando","Plano não chega o contratado - FTTH",0,"$RR","informou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico na sua PON está dentro dos padrões. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, verificamos a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Após essas verificações, realizamos um teste adicional no velocímetro, e agora a velocidade atingiu o contratado, porém, voltou a abaixar. Devido isso, o cliente ficou de continuar testando durante o restante do dia e caso continue persistido, irá entrar em contato para enviarmos uma equipe para analisar.","Plano não chega o contratado - FTTH"],
    ["Plano no wi-fi - Ficou testando","Plano não chega o contratado - FTTH",0,"$RR","relatou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede sem fio. Verificamos que o sinal óptico de sua PON estava dentro dos padrões. Nesse contexto, explicamos sobre a garantia de entrega de velocidade apenas na rede cabeada e oferecemos um procedimento remoto para tentar melhorar, embora não pudéssemos garantir o mesmo desempenho na rede sem fio. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do aparelho usado para testar. Apesar dessas verificações, o teste no velocímetro ainda indicou uma velocidade inferior à garantida. Diante dessa situação, o cliente ficou de realizar o teste no cabo quando puder.","Plano não chega o contratado - FTTH"],
    ["Plano no wi-fi - externo","Plano não chega o contratado - FTTH",1,"$RR","relatou enfrentar problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede sem fio. Verificado o sinal óptico de sua PON estava dentro dos padrões. Nesse contexto, explicamos sobre a garantia de entrega de velocidade apenas na rede cabeada e oferecemos um procedimento remoto para tentar melhorar, embora não pudéssemos garantir o mesmo desempenho na rede sem fio. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do aparelho usado para testar. Apesar dessas verificações, o teste no velocímetro ainda indicou uma velocidade inferior à garantida. Diante dessa situação, o cliente solicitou a presença de uma equipe no local, com um notebook e cabo de rede da Brisanet para uma inspeção direta e comprovação da entrega do plano. Foi gerada uma Ordem de Serviço (O.S.) para efetuar essa inspeção.$AG","Plano não chega o contratado"],
    ["Placa de rede FE","Plano não chega o contratado - FTTH",0,"$RR","relatou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Após verificar que o sinal óptico na sua PON está dentro dos padrões, procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Após essas verificações, realizamos um teste adicional no velocímetro; no entanto, a velocidade continuou na mesma média de 90 Mbps. Verificamos que o cabo de rede é CAT. 5E e, ao examinar a placa de rede, identificamos que o problema está sendo ocasionado pela placa de rede FE (/100). O cliente está ciente dessa situação.","Plano não chega o contratado - FTTH"],
    ["Placa de rede FE - externo","Plano não chega o contratado - FTTH",1,"$RR","relatou enfrentar problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Após verificar que o sinal óptico na sua PON está dentro dos padrões, realizamos os procedimentos padrão, conforme documentados nos registros de eventos, e recomendamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Após essas verificações, realizamos um teste adicional no velocímetro; no entanto, a velocidade continuou na mesma média de 90 Mbps. Verificamos que o cabo de rede é CAT. 5E e, ao examinar a placa de rede, identificamos que o problema está sendo ocasionado pela placa de rede FE (/100). O cliente está ciente dessa situação, mas deseja a visita de uma equipe para confirmar que está recebendo o serviço contratado. Diante disso, geramos uma Ordem de Serviço (O.S.) para realizar uma inspeção presencial no local.$AG","Plano não chega o contratado"],
    ["Rota com sinal irregular","Rota com sinal irregular - FTTH",0,"$RF","relata interrupção do serviço de acesso à internet. Após análise, constatou-se anomalia no sinal da PON. A rota foi verificada e apresenta falhas. O cliente foi informado sobre o prazo de 24 horas para a resolução do problema, que está relacionado à rota.","Rota com sinal irregular - FTTH"],
    ["Transferência para o setor cancelamento","Informação cancelamento",0,"$RF","transferido para o setor de cancelamento. O cliente solicitou o cancelamento do serviço da brisanet e recusou qualquer tipo de tratativa.","Informação cancelamento"],
    ["Instalação Mal Sucedida","Instalação mal sucedida (sem acesso) - 7d",1,"Reclamação de instalação de serviço","Instalação recente com pendência de sinal/alinhamento. Aberta prioridade para retorno técnico.","Instalação mal sucedida (sem acesso) - 7d"],
    ["Não está no local","Instabilidade na entrega do serviço",0,"$RF","entra em contato informando problema nos serviços da Brisanet, porém, durante a sondagem foi verificado que o mesmo não está na residência para verificar ou testar o serviço. O mesmo ficou de entrar em contato quando estiver no local.","Instabilidade na entrega do serviço"],
    ["Já solucionado","Informações do serviço",0,"$RF","comunica que no início do atendimento a questão já foi solucionada, tornando desnecessária a continuação do suporte.","Informações do serviço"],
    ["Falta de cordialidade","Instabilidade na entrega do serviço",0,"$RF","reporta um problema nos serviços da brisanet. Entretanto, durante o atendimento, houve o uso de linguagem inadequada, o que me levou a encerrar a conversa.","Instabilidade na entrega do serviço"],
    ["Em horário de expediente","Instabilidade na entrega do serviço",0,"$RF","entra em contato informando problema nos serviços da Brisanet, porém, durante a sondagem foi verificado que o mesmo está em horário de expediente, e por isso não podemos realizar a tratativa do problema. O mesmo ficou de entrar em contato quando estiver disponível.","Instabilidade na entrega do serviço"],
    ["Urgência de última hora","Instabilidade na entrega do serviço",0,"$RF","comunica dificuldades com o serviço da brisanet. Durante a verificação, constatou-se que o cliente não estava em disponível para dar continuidade ao processo. Ele entrará em contato quando estiver disponível.","Cabo da fibra rompido"],
    ["Solicitação de cancelamento","Solicitação de cancelamento",0,"$RF","entrou em contato solicitando o cancelamento dos serviços Brisanet. Cliente ciente que o nosso setor de retenção entrará em contato com a mesma.","Solicitação de cancelamento"],
    ["Procedimento somente com o titular","Atendimento encerrado - Não é o titular",0,"$RF","solicita atendimento que envolve negociação/alteração de dados do cadastro, Por questões de segurança dos dados pessoais do titular, informamos que só podemos proceder após conversar diretamente com o titular do contrato.","Atendimento encerrado - Não é o titular"],
    ["Comando CRM","Sem acesso",0,"$RR","Relata que está sem acesso à internet. Verificamos o comando CRM no sistema e reforçamos o prazo de 24 horas para a resolução do problema. Ressaltamos que se trata do comando de ativação do serviço.","Sem acesso"],
    ["Ping na rede cabeada - Resolvido","Ping alto",0,"$RF","relatou problemas com alta latência (ping) ao jogar, mesmo utilizando uma conexão cabeada. Após confirmar as informações do titular, foi feita uma reconfiguração da rede e o cliente foi orientado a reiniciar o roteador. A latência foi reduzida para 60 ms, ficando dentro da garantia da brisanet.","Cabo da fibra rompido"],
    ["Ping na rede cabeada - Ficou testando","Ping alto",0,"$RR","relatou problemas com alta latência (ping) ao jogar, mesmo utilizando uma conexão cabeada. Após confirmar as informações do titular, foi feita uma reconfiguração da rede e o cliente foi orientado a reiniciar o roteador. A latência foi reduzida para 60 ms, ficando dentro da garantia da brisanet. O cliente foi instruído a monitorar o desempenho ao longo do dia e a entrar em contato novamente se o problema persistir, para que uma equipe técnica especializada possa ser enviada.","Ping alto"],
    ["Ausência de confirmação da ID positiva","Ausência de confirmação de dados",0,"$RF","não procedeu com a confirmação dos dados correspondentes ao titular durante o decorrer do atendimento. Em razão da segurança do titular, o atendimento foi encerrado. Foi feita a requisição dos dados em três ocasiões.","Ausência de confirmação de dados"],
    ["Cobrança de cancelamento","Informação cancelamento",0,"$RF","entrou em contato para cobrar um retorno em relação à sua solicitação de cancelamento. Ele forneceu o número de contato, e o prazo para o retorno foi devidamente comunicado. Ainda, foi esclarecido que ele pode encurtar o processo ao se dirigir diretamente ao setor competente por meio do número 0800 281 3017.","Informação cancelamento"],
    ["Valores do cancelamento","Informação cancelamento",0,"$RF","busca informações sobre os valores do contrato de fidelização em caso de cancelamento. Identificamos um erro no sistema que impede a obtenção dessas informações. Encaminhamos o contato para o setor de retenção, capacitado para fornecer as informações desejadas.","Informação cancelamento"],
    ["Manutenção no Revan","Sistema interno indisponível",0,"$RF","fez contato, porém, foi explicado a ele que, naquele momento, o nosso sistema interno estava em manutenção e devido a isso, não tínhamos como fazer nenhum procedimento remoto, sendo necessário aguardar. Foi fornecido o prazo estimado pela URA para a regularização da situação. O cliente foi informado e está ciente dos detalhes.","Sistema interno indisponível"],
    ["Desconto por Rota Inoperante","Desconto de rota inoperante",0,"$RF","Entra em contato para solicitar desconto referente ao tempo que ficou sem acesso. Foi repassado que o desconto é fornecido somente pelo nosso setor financeiro, que pode ser contactado por ligação no número 0800 281 3017.","Informações do serviço"],
    ["Instabilidade geral em TP-links","Instabilidade TP-Link",0,"$RR","entra em contato informando instabilidade em seu roteador da TP-link. Verificado um problema geral onde não é possivel realizar nenhuma tratatativa em roteadores da marca TP-link. Repassado prazo conforme a URA.","Instabilidade TP-Link"],
    ["Problema geral na cidade","Instabilidade na entrega do serviço",0,"$RF","relata instabilidade nos serviços da brisanet, devido a um problema geral na cidade do cliente, não foi possível realizar uma verificação completa no momento. Cliente foi orientado a entrar em contato novamente quando o acesso estiver normalizado. Cliente ciente e de acordo.","Instabilidade na entrega do serviço"],
    ["OLT em Manutenção","Problema na OLT",0,"$RF","Entrou em contato relatando falta de internet. Foi informado que há uma manutenção em andamento na OLT que afeta o sinal do cliente e de vários outros clientes. Foi repassado o prazo máximo de normalização conforme a URA, porém o serviço pode voltar a qualquer momento. Cliente foi orientado a entrar em contato com o setor financeiro para solicitar desconto referente ao tempo sem acesso após a normalização. Cliente ciente e de acordo.","Informações do serviço"],
    ["Problema em roteador particular - Técnico particular","Suporte a equipamento particular",0,"$SA","relatou problemas com seu roteador particular, que estava sem acesso à internet. Após a verificação, foi constatado que o roteador da Brisanet estava funcionando normalmente, mas o roteador específico continuava sem conexão. Foi recomendado que o cliente reinicie o roteador particular, logo após ser reconfigurado os equipamentos da brisanet. Como o acesso não retornou, foi recomendado que verifique as configurações, conexões de cabos e possíveis interferências. Caso o problema persista, foi sugerido entrar em contato com o suporte técnico do roteador para assistência personalizada.","Suporte a equipamento particular"],
    ["BrisaCliente - Primeiro acesso","BrisaCliente",0,"$RR","está buscando assistência para acessar o aplicativo BrisaCliente. Foi fornecido um guia com todos os passos","BrisaCliente"],
    ["BrisaCliente - Primeiro acesso escritorio","BrisaCliente",0,"$RR","entrou em contato relatando que não estava recebendo o SMS de confirmação para realizar o primeiro acesso ao aplicativo BrisaCliente. Foi solicitado um número que pudesse receber SMS, mas o problema persistiu. Diante da falta de outro número disponível com o mesmo DDD, foi informado que seria necessário visitar uma loja ou escritório da empresa para que a configuração fosse realizada.","BrisaCliente"],
    ["BrisaCliente - Recuperar a senha","BrisaCliente",0,"$RR","pediu ajuda para recuperar a senha do aplicativo BrisaCliente. Enviamos um passo a passo para guiá-lo durante o processo de recuperação.","BrisaCliente"],
    ["Globoplay - Primeiro acesso","Globoplay",0,"$RR","está buscando assistência para acessar o aplicativo Globoplay. Foi fornecido um guia com todos os passos","Globoplay"],
    ["Globoplay - Suporte do serviço","Globoplay",0,"$RR","entrou em contato relatando um problema com o aplicativo GloboPlay na TV, mencionando que uma série que estava assistindo não carregava há duas semanas. Após realizar uma reconfiguração da rede e confirmar que a conexão estava funcionando corretamente, foi identificado que o problema estava no próprio aplicativo da GloboPlay. O cliente foi orientado a entrar em contato com o suporte da GloboPlay através dos números 0800 881 8000 ou 4003 8000 para resolver o problema.","Globoplay"],
    ["Netflix - Primeiro acesso","Netflix",0,"$RR","está buscando assistência para acessar o aplicativo Netflix. Foi fornecido um guia com todos os passos","Netflix"],
    ["PON Piscando - GPON","PON piscando - FTTH",0,"$RF","Entra em contato informando que está sem acesso, verificado que o LED PON está piscando, dessa forma foi reconfigurado a ONU e o problema persistiu. Foi tentado mais uma vez e o problema ainda persiste. O problema foi repassado pela liderança para o GPON verificar. Prazo de 24 horas. Cliente ciente do retorno.","PON Piscando"],
    ["Alteração de cômodo","Alteração de cômodo",1,"$SA","fica ciente do prazo, há questões de valores: R$ 30,00 pela alteração; no caso de utilização de novo cabo FTTH/RJ45, são mais R$1,30 por metro utilizado. Confirmado CPF e endereço. PS: levar termo de compromisso para ser assinado pelo cliente ou responsável. E anexar imagem ao chamado, também como do lugar onde ficou o equipamento.","Alteração de cômodo"],
    ["Revisão de equipamento","Revisão de Equipamento",1,"$RR","entrou em contato via Whatsapp informando estar com instabilidade e problemas de conexão. Informado ao cliente sobre as instabilidades da rede WI-FI, sobre o alcance da rede WI-FI e testes via WI-FI. Canais foram alterados, sinal e IP normal, ONU Ativada/reconfigurada. O Cliente informa que a sua conexão não melhorou, por gentileza, passar, verificar se existe algum problema lógico na ONU do cliente, caso seja constatado, por gentileza, entrar em contato com o suporte regional e realizar a troca da ONU, se autorizado, por outra de mesmo modelo a fim de verificar melhorias na conexão e reforçar também as informações supracitadas. PS. Caso alguma informação sobre serviço adicional (troca de ONU, cabo de rede, alteração de parede ou cômodo) for informada ao cliente, por gentileza, registrar no chamado.","Revisão de Equipamento"],
    ["Configuração Estruturada de Rede Interna","Configuração Estruturada de Rede Interna",1,"$SA","Entrou em contato solicitando a visita de um técnico para configurar e instalar um aparelho particular na sua residência, dessa forma foi aberto uma O.S. Por gentileza, passar no local realizar a configuração da sua rede interna, o cliente está ciente que o tal procedimento é gerado uma taxa de R$ 90,00 reais, podendo ser dividido em até 3X. onde o cliente tem direito a 20 metros de cabo de rede, caso seja utilizado metragem de cabos superior a 20 metros será cobrado mais R$ 1,30 por metro. CPF confirmado. Cliente ciente do prazo e no aguardo.","Configuração Estruturada de Rede Interna"],
    ["Hibernação chat","Hibernação chat",0,"$RF","O cliente permaneceu inativo por 10 minutos, mesmo após o envio de alertas de hibernação. Diante da continuidade da inatividade, o mesmo foi realocado para a fila de hibernação.","$SA"],
    ["Area interditada sem retorno","Rota Inoperante",0,"$RF","O cliente relatou indisponibilidade do serviço de internet há quatro dias. Foi verificado em sistema que a região do cliente está classificada como área de risco, o que impede a realização de manutenções pela operadora no momento. O atendimento foi finalizado após o esclarecimento sobre as restrições operacionais na área.","$SA"],
    ["Função - WPS","Informação Técnica",0,"$RF","entrou em contato solicitando conexão via WPS em sua impressora, foi informado que a função é bloqueada de fábrica nos equipamentos da brisanet, o cliente ficou ciente de que só é possível utilizar essa função em um roteador particular.","Informação Técnica"],
    ["Torre inoperante - FWA","Torre inoperante - FWA",0,"$RF","Cliente entrou em contato informando falta de acesso à internet. Verificado em sistema e constatado que a torre está fora do ar. Foi informado ao cliente o prazo de 12 horas para normalização. Cliente ciente e aguarda retorno.","$SA"],
    ["LENTIDÃO - Resolvido FWA","Lentidão - FWA",0,"$RF","Cliente relatou lentidão no FWA durante o uso. Após a verificação inicial, foram realizados os procedimentos informados no treinamento, incluindo ajustes no equipamento e testes de conectividade. Com isso, foi possível restabelecer o acesso, e a lentidão foi resolvida. O cliente confirmou que o serviço voltou a operar normalmente, sem mais sinais de instabilidade.","$SA"],
    ["CPE sem sinal - FWA","CPE sem sinal - FWA",1,"$RF","Informou estar sem acesso. Verificado equipamento(s) ligado(s) e led vermelho piscando; cliente informou que ninguém mexeu no(s) equipamento(s). Verificado na planilha de acompanhamento 5G. Aberto O.S para verificação no local.","CPE sem sinal - FWA"],
    ["LED 5G - APAGADO - Resolvido (FWA)","CPE sem sinal - FWA",0,"$RF","entrou em contato informando que o LED 5G estava apagado. Foi verificado que o problema estava relacionado ao cartão SIM não conectado. O cliente foi orientado a verificar se o chip estava corretamente inserido e reiniciar o aparelho. Após seguir as instruções, o acesso foi normalizado e o LED 5G acendeu.","CPE sem sinal - FWA"],
    ["LED 5G - APAGADO - Aguarda o prazo (FWA)","CPE sem sinal - FWA",0,"$RF","relatou que o LED 5G estava apagado. Ao verificar a conexão do cartão SIM e reiniciar o aparelho, o problema persistiu. Foi consultada a liderança e identificado que o problema está relacionado ao rádio. Foi repassado o prazo para normalização do serviço e o cliente foi informado sobre a previsão de resolução.","CPE sem sinal - FWA"],
    ["LED 5G - APAGADO - Externo (FWA)","CPE sem sinal - FWA",1,"$RF","informou que o LED 5G estava apagado. Verificado que o cartão SIM estava conectado e o aparelho foi reiniciado, mas o problema persistiu. Após verificar que o sistema estava normal e o problema continuava, foi aberta uma Ordem de Serviço para verificação no local. Será realizado contato com o cliente para agendamento da visita técnica.","CPE sem sinal - FWA"],
    ["LED 5G - Pis Vermelho - Resolvio (FWA)","CPE sem sinal - FWA",0,"$RF","informou que o LED estava piscando vermelho, indicando ausência de rede. Foi confirmado com a liderança que o status do servidor estava normal (up). Após verificar a situação e realizar os procedimentos necessários, o problema foi resolvido e a conexão foi restabelecida.","CPE sem sinal - FWA"],
    ["LED 5G - Pis Vermelho - Externo (FWA)","CPE sem sinal - FWA",1,"$RF","relatou que o LED estava piscando vermelho, sinalizando falta de rede. Confirmado com a liderança que o status do servidor estava normal (up). Como o problema persistiu após a verificação interna, foi aberto um chamado externo para a solução do problema. Cliente ciente do chamado e aguarda resolução.","CPE sem sinal - FWA"],
    ["LENTIDÃO - Resolvido (FWA)","Lentidão - FWA",0,"$RF","relatou lentidão no FWA durante o uso. Após a verificação inicial, foram realizados os procedimentos informados no treinamento, incluindo ajustes no equipamento e testes de conectividade. Com isso, foi possível restabelecer o acesso, e a lentidão foi resolvida. O cliente confirmou que o serviço voltou a operar normalmente, sem mais sinais de instabilidade.","Lentidão - FWA"],
    ["Lentidão - Externo (FWA)","Lentidão - FWA",1,"$RF","relatou problema de conectividade no FWA. Após verificação detalhada no sistema, constatou-se que o problema está relacionado à conexão externa, fora do controle local. O cliente foi informado que, no momento, não é possível realizar intervenções internas e que a questão envolve apenas a infraestrutura externa. Aguardando ações necessárias pela equipe responsável por essa área.","Lentidão - FWA"],
    ["Personalização de rede - Nome e Senha (FWA)","Alterações nas configurações do Wi-Fi - FWA",0,"$RF","entrou em contato solicitando a personalização do nome da rede e da senha do WIFI FWA. As configurações foram ajustadas conforme solicitado. O cliente foi informado sobre a alteração e confirmou que a conexão está funcionando corretamente.","Alterações nas configurações do Wi-Fi - FWA"],
    ["Personalização de rede - Nome (FWA)","Alterações nas configurações do Wi-Fi - FWA",0,"$RF","solicitou a personalização apenas do nome da rede WIFI FWA. O ajuste foi realizado conforme a solicitação, e o cliente foi informado sobre a mudança. Após verificar a conexão, o cliente confirmou que está tudo OK e que a rede está funcionando perfeitamente.","Alterações nas configurações do Wi-Fi - FWA"],
    ["Personalização de rede - Senha (FWA)","Alterações nas configurações do Wi-Fi - FWA",0,"$RF","entrou em contato solicitando a personalização do nome da rede e da senha do WIFI FWA. As configurações foram ajustadas conforme solicitado. O cliente foi informado sobre a alteração e confirmou que a conexão está funcionando corretamente.","Alterações nas configurações do Wi-Fi - FWA"],
    ["Cobrança de reparo (Dentro do prazo)","COBRANÇA DE REPARO DENTRO DO PRAZO",0,"$RF","Entrou em contato cobrando atendimento, visto o mesmo encontrar-se dentro do prazo, informado e reforçado prazo ao cliente, o mesmo ciente. Por gentileza, verificar e priorizar..","COBRANÇA DE REPARO DENTRO DO PRAZO"],
    ["spam","Solicitação de dados",0,"Sem serviço","Atendimento finalizado por spam, cliente encaminhou inúmeras vezes a mesma mensagem tornando inviável prosseguir com o atendimento.",""],
    ["los com valor","",0,"L","",""],
    ["Nova mensagem","",0,"Sem serviço","",""],
    ["Suspeita de LOS com valor","Suspeita de LOS",1,"$RF","Cliente informa haver um LED vermelho piscando. Questionado se LED LOS estava ativa, se havia ocorrido acidentes ou alguma remoção de equipamento e se havia tido quedas de energias recentes, o cliente informou que tem uma luz vermelha acesa e não para as outras perguntas. Verificada que a rota está normal. Aberto O.S. para verificação no local. Cliente ciente do valor de R$20,00 pelo envio da equipe e pode ser gerado mais valores. Realizar contato para agendamento.","los"],
    ["COBRANÇA DE REPARO FORA DO PRAZO","COBRANÇA DE REPARO FORA DO PRAZO",0,"Sem serviço","Cliente entrou em contato informando que a visita técnica permanece pendente e já se encontra fora do prazo previsto. Realizada cobrança junto à equipe responsável, solicitando prioridade no atendimento devido ao atraso. Cliente orientado a aguardar, sendo informado de que a solicitação está sendo acompanhada até a conclusão da visita.",""]
];

var raw=rawD.map(function(r){
    var s=r[3],m=r[4];
    for(var k in D){
        s=s.split(k).join(D[k]);
        m=m.split(k).join(D[k]);
    }
    return [r[0],r[1],!!r[2],s,m,r[5]];
});

var base=raw.map(function(r,i){
    var x=r[2],n=r[1],s=r[3],t=r[0];
    var te=x?n:"",se=s;
    if(x){
        if(t.indexOf("Lentidão")!==-1){te="Lentidão";se="reparo rápido";}
        else if(t.indexOf("Suspeita de LOS")!==-1||t.indexOf("PON Piscando")!==-1||t.indexOf("Sinal irregular")!==-1||t.indexOf("CPE sem sinal")!==-1){
            te=t.indexOf("LOS")!==-1?"Suspeita de LOS":t.indexOf("PON")!==-1?"PON Piscando":t.indexOf("Sinal")!==-1?"Sinal Irregular Fibra":"CPE sem sinal";
            se="reparo físico";
        }
        else if(t.indexOf("PON Apagada")!==-1||t.indexOf("Quedas na conexão")!==-1||t.indexOf("Sem gerencia")!==-1||t.indexOf("Sem acesso com sinal")!==-1||t.indexOf("Plano")!==-1||t.indexOf("Revisão")!==-1){
            te=t.indexOf("PON")!==-1?"PON Apagada":t.indexOf("Quedas")!==-1?"Instabilidade TP-LINK (reparo rápido)":t.indexOf("gerencia")!==-1?"Sem acesso TP-LINK":t.indexOf("Sem acesso")!==-1?"Sem acesso":t.indexOf("Revisão")!==-1?"Revisão de Equipamento":"Plano não chega o contratado";
            se="reparo rápido";
        }
        else if(t.indexOf("Fibra Rompida")!==-1||t.indexOf("Fibra Ressecada")!==-1){te="Cabo da Fibra Rompido";se="reparo físico";}
        else if(t.indexOf("cômodo")!==-1||t.indexOf("Configuração Estruturada")!==-1){te=t.indexOf("cômodo")!==-1?"Alteração de cômodo":"Configuração Estruturada de Rede Interna";se="serviço adicional";}
    }
    return {id:i,titulo:t,etiqueta:n,externo:x,servico:se,mensagem:r[4],etiqueta_externo:te};
});

var thmStyles={
    black_red:{bg:'#08060f',border:'#dc2626',text:'#f1f5f9',inBg:'#1a0505',inBdr:'#991b1b',btnBg:'#0284c7',headTxt:'#fca5a5',glow:'rgba(220,38,38,0.45)',btnBorder:'#dc2626'},
    light_basic:{bg:'#ffffff',border:'#cbd5e1',text:'#0f172a',inBg:'#f8fafc',inBdr:'#94a3b8',btnBg:'#2563eb',headTxt:'#1e293b',glow:'rgba(148,163,184,0.3)',btnBorder:'#2563eb'},
    dark_basic:{bg:'#121212',border:'#333333',text:'#e0e0e0',inBg:'#1e1e1e',inBdr:'#444444',btnBg:'#3b82f6',headTxt:'#f3f4f6',glow:'rgba(0,0,0,0.5)',btnBorder:'#555555'},
    white_blue:{bg:'#ffffff',border:'#0284c7',text:'#0f172a',inBg:'#f0f9ff',inBdr:'#0284c7',btnBg:'#0284c7',headTxt:'#0369a1',glow:'rgba(2,132,199,0.3)',btnBorder:'#0284c7'},
    purple_black:{bg:'#090514',border:'#7e22ce',text:'#e9d5ff',inBg:'#1e1035',inBdr:'#6b21a8',btnBg:'#9333ea',headTxt:'#d8b4fe',glow:'rgba(126,34,206,0.5)',btnBorder:'#a855f7'},
    green_yellow:{bg:'#022c22',border:'#eab308',text:'#fef08a',inBg:'#064e3b',inBdr:'#854d0e',btnBg:'#15803d',headTxt:'#fef08a',glow:'rgba(234,179,8,0.4)',btnBorder:'#eab308'},
    black_blue:{bg:'#030712',border:'#0284c7',text:'#e0f2fe',inBg:'#0f172a',inBdr:'#0369a1',btnBg:'#0284c7',headTxt:'#38bdf8',glow:'rgba(2,132,199,0.5)',btnBorder:'#38bdf8'},
    black_yellow_rays:{bg:'#0c0a09',border:'#facc15',text:'#fef08a',inBg:'#1c1917',inBdr:'#ca8a04',btnBg:'#ca8a04',headTxt:'#fef08a',glow:'rgba(250,204,21,0.6)',btnBorder:'#facc15'},
    orange_5g:{bg:'#431407',border:'#f97316',text:'#ffffff',inBg:'#7c2d12',inBdr:'#c2410c',btnBg:'#ea580c',headTxt:'#ffedd5',glow:'rgba(249,115,22,0.5)',btnBorder:'#fdba74'},
    custom:{bg:savedBg,border:savedBdr,text:'#ffffff',inBg:'#111827',inBdr:savedBdr,btnBg:savedBdr,headTxt:'#ffffff',glow:savedBdr,btnBorder:savedBdr}
};

var iconSVGs={
    sol:'<svg viewBox="0 0 24 24" class="hud-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    lua:'<svg viewBox="0 0 24 24" class="hud-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    mar:'<svg viewBox="0 0 24 24" class="hud-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7-0.5"/><path d="M2 17c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 7-0.5"/></svg>',
    estrelas:'<svg viewBox="0 0 24 24" class="hud-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    nuvem:'<svg viewBox="0 0 24 24" class="hud-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
    akatsuki:'<svg viewBox="0 0 100 100" class="hud-icon" style="background:#000;border-radius:50%;"><path d="M25 65 Q 15 60, 20 50 Q 25 40, 35 40 Q 40 25, 55 30 Q 70 30, 75 45 Q 85 50, 80 65 Q 75 75, 60 70 L 40 70 Q 30 75, 25 65 Z" fill="#dc2626" stroke="#ffffff" stroke-width="3"/></svg>'
};

function applyLiveStyle(tk,ik,fk,tc,cb,cbd){
    ls.setItem('y_hud_theme',tk);ls.setItem('y_hud_icon',ik);ls.setItem('y_hud_font',fk);
    if(tc)ls.setItem('y_hud_tclr',tc);if(cb)ls.setItem('y_hud_c_bg',cb);if(cbd)ls.setItem('y_hud_c_bdr',cbd);
    var cT=thmStyles[tk]||thmStyles.black_red;
    if(tk==='custom'){
        cT.bg=cb||savedBg;cT.border=cbd||savedBdr;cT.inBdr=cbd||savedBdr;
        cT.btnBg=cbd||savedBdr;cT.btnBorder=cbd||savedBdr;cT.glow=cbd||savedBdr;
    }
    var cFont=fontFamilies[fk]||fontFamilies.cyber,
        cSize=fontSizes[fk]||fontSizes.cyber,
        fTxt=tc||ls.getItem('y_hud_tclr')||cT.text,
        f=d.getElementById('m-custom-font');
    if(f)f.href=fontLinks[fk]||fontLinks.cyber;
    var sTag=d.getElementById('m-yoda-circuit-hud');
    if(sTag){
        sTag.innerHTML="#m-ui{--bg:"+cT.bg+";--border:"+cT.border+";--text:"+fTxt+";--inBg:"+cT.inBg+";--inBdr:"+cT.inBdr+";--btnBg:"+cT.btnBg+";--headTxt:"+cT.headTxt+";--glow:"+cT.glow+";--btnBorder:"+cT.btnBorder+";--fFamily:"+cFont+";--fSize:"+cSize+";position:fixed;bottom:80px;right:20px;width:660px;height:520px;background-color:var(--bg);border:2px solid var(--border);border-radius:8px;z-index:2147483647;font-family:var(--fFamily);font-size:var(--fSize);box-shadow:0 0 25px var(--glow);color:var(--text);box-sizing:border-box;overflow:hidden}"+
        "#m-sidebar{width:135px;background:var(--bg);border-right:2px solid var(--border);display:flex;flex-direction:column;padding:10px 0}"+
        ".side-item{padding:10px 12px;cursor:pointer;color:var(--text);font-weight:700;font-size:calc(var(--fSize) - 1px);border-left:3px solid transparent;transition:.2s;display:flex;align-items:center;gap:8px}"+
        ".side-item:hover{background:var(--inBg);border-left-color:var(--glow)}"+
        ".side-item.active{background:var(--inBg);border-left-color:var(--btnBorder);color:var(--headTxt)}"+
        "#m-content-area{flex:1;background:var(--inBg);position:relative;display:flex;flex-direction:column}"+
        "#m-head{display:flex;justify-content:space-between;font-weight:700;color:var(--headTxt);padding:10px 14px;border-bottom:2px solid var(--border);background:var(--bg)}"+
        ".content-panel{flex:1;overflow-y:auto;overflow-x:hidden;padding:12px}"+
        ".content-panel::-webkit-scrollbar{width:6px}"+
        ".content-panel::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}"+
        ".dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}"+
        ".dash-card{background:var(--bg);border:1px solid var(--inBdr);border-radius:6px;padding:10px;box-shadow:0 2px 8px rgba(0,0,0,.2)}"+
        ".dash-card-title{font-size:calc(var(--fSize) - 1px);color:var(--headTxt);font-weight:700;margin-bottom:8px;border-bottom:1px solid var(--inBdr);padding-bottom:4px;display:flex;justify-content:space-between}"+
        ".dash-val{font-size:var(--fSize);color:var(--text)}"+
        "#m-btn{--bg:"+cT.bg+";--btnBorder:"+cT.btnBorder+";--glow:"+cT.glow+";position:fixed;bottom:20px;right:20px;z-index:2147483647;width:60px;height:60px;background:var(--bg);border:2px solid var(--btnBorder);border-radius:50%;cursor:pointer;box-shadow:0 0 15px var(--glow);display:flex;align-items:center;justify-content:center;transition:.3s;padding:6px;color:"+cT.btnBorder+"}"+
        "#m-btn:hover{box-shadow:0 0 25px var(--glow);transform:scale(1.05)}"+
        "#m-ui input:not([type=\"radio\"]):not([type=\"checkbox\"]),#m-ui textarea,#m-ui select{width:100%;margin:4px 0 8px;padding:7px;background:var(--inBg);color:var(--text);border:1px solid var(--inBdr);border-radius:4px;outline:0;font-family:inherit;font-size:var(--fSize);box-sizing:border-box}"+
        "#m-ui input:focus,#m-ui textarea:focus,#m-ui select:focus{border-color:var(--border);box-shadow:0 0 8px var(--glow)}"+
        ".seg{display:flex;border:1px solid var(--inBdr);border-radius:4px;overflow:hidden;margin-bottom:8px}"+
        ".seg label{flex:1;text-align:center;padding:7px;margin:0;cursor:pointer;color:var(--text);font-size:calc(var(--fSize) - 1px);background:var(--inBg);text-transform:uppercase;transition:.2s}"+
        ".seg input[type=\"radio\"]{display:none}"+
        ".seg input[type=\"radio\"]:checked+label{background:var(--border);color:#fff;font-weight:700}"+
        ".tw{display:flex;align-items:center;gap:6px;font-size:calc(var(--fSize) - 1px);color:var(--headTxt);text-transform:uppercase}"+
        ".tg{position:relative;width:28px;height:16px;background:var(--inBg);border:1px solid var(--inBdr);border-radius:8px;cursor:pointer;margin:0;transition:.2s}"+
        ".tg::after{content:\"\";position:absolute;top:2px;left:2px;width:10px;height:10px;background:var(--border);border-radius:50%;transition:.2s}"+
        "input[type=\"checkbox\"]:checked+.tg{background:var(--border)}"+
        "input[type=\"checkbox\"]:checked+.tg::after{left:14px;background:#fff}"+
        "input[type=\"checkbox\"]{display:none}"+
        "#m-go,.dash-btn{width:100%;background:var(--btnBg);color:#fff;border:none;border-radius:4px;padding:8px;font-weight:700;font-size:calc(var(--fSize) + 1px);cursor:pointer;text-transform:uppercase;box-shadow:0 0 12px var(--glow);margin-top:4px;transition:.2s}"+
        "#m-go:hover,.dash-btn:hover{filter:brightness(1.2)}"+
        ".hud-icon{width:70%;height:70%}"+
        ".ia-btn{background:var(--btnBg)!important;color:#fff!important;font-size:calc(var(--fSize) - 1px)!important;padding:8px!important;margin:0!important;border:1px solid var(--btnBg)!important;width:100%;cursor:pointer;border-radius:4px;font-weight:700;transition:.2s}"+
        ".ia-btn:hover{filter:brightness(1.2)}"+
        ".util-btn{flex:1;margin:0;background:var(--inBg)!important;color:var(--text)!important;border:1px solid var(--inBdr)!important;font-size:calc(var(--fSize) - 1px)!important;padding:8px!important;cursor:pointer;border-radius:4px;font-weight:700;transition:.2s}"+
        ".util-btn:hover{border-color:var(--btnBg)!important;color:var(--btnBg)!important}"+
        ".cfg-sel{font-size:calc(var(--fSize) - 2px)!important;padding:3px!important;margin:0!important;width:100%!important;display:block;cursor:pointer;background:var(--inBg);color:var(--text);border:1px solid var(--inBdr);margin-bottom:4px!important}"+
        "#tag-display{font-size:calc(var(--fSize) - 2px);color:var(--text);background:var(--bg);border:1px solid var(--inBdr);padding:6px;border-radius:4px;margin-bottom:6px;text-align:center}"+
        "#m-iframe-modal{position:fixed;top:5vh;left:10vw;width:80vw;height:90vh;background:var(--bg);border:2px solid var(--border);border-radius:8px;z-index:2147483647;box-shadow:0 0 30px var(--glow);flex-direction:column;overflow:hidden}"+
        "#ghostbu-board{display:grid;background:var(--bg);border:2px solid var(--border);border-radius:6px;padding:3px;gap:2px;box-sizing:border-box;user-select:none;margin:0 auto}"+
        ".gb-cell{display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;cursor:pointer;border-radius:3px;transition:background-color .15s,transform .05s}"+
        ".gb-cell:active{transform:scale(.94)}"+
        ".gb-cell.has-x{color:#94a3b8;font-size:13px}"+
        ".gb-cell.has-ghost{animation:gb-pop .2s ease-out}"+
        ".gb-cell.invalid{box-shadow:inset 0 0 0 2px #ef4444!important}"+
        "@keyframes gb-pop{0%{transform:scale(0)}80%{transform:scale(1.2)}100%{transform:scale(1)}}"+
        ".gb-nav-btn{background:var(--bg);border:1px solid var(--inBdr);color:var(--text);padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;transition:.2s}"+
        ".gb-nav-btn:hover{border-color:var(--btnBorder)}"+
        ".gb-nav-btn:disabled{opacity:.4;cursor:not-allowed;border-color:transparent!important}"+
        "#gb-toast{position:absolute;top:45px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:700;box-shadow:0 4px 15px rgba(0,0,0,.4);display:none;z-index:10;animation:gb-pop .3s ease-out}"+
        ".game-layout{display:flex;gap:12px;align-items:flex-start}"+
        ".game-left{flex:0 0 280px}"+
        ".game-rules-box{flex:1;background:var(--bg);border:1px solid var(--inBdr);border-radius:6px;padding:10px;font-size:9.5px;line-height:1.45;color:var(--text);box-shadow:0 2px 6px rgba(0,0,0,.2);max-height:430px;overflow-y:auto}"+
        ".game-rules-box::-webkit-scrollbar{width:4px}"+
        ".game-rules-box::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}"+
        ".rules-title{font-weight:700;color:var(--headTxt);margin-bottom:6px;border-bottom:1px solid var(--inBdr);padding-bottom:3px;font-size:10.5px;text-transform:uppercase}"+
        "#gb-prize-banner{display:none;background:#f59e0b;color:#000;padding:8px;border-radius:6px;font-size:10.5px;font-weight:bold;margin-bottom:8px;line-height:1.3;box-shadow:0 0 15px rgba(245,158,11,.6);animation:gb-pop .3s ease-out}";
    }
    var btn=d.getElementById('m-btn');
    if(btn) btn.innerHTML=iconSVGs[ik]||iconSVGs.akatsuki;
}

var s=d.createElement('style');s.id='m-yoda-circuit-hud';d.head.appendChild(s);
var b=d.createElement('div');b.id='m-btn';b.className='m-float-btn';b.style.bottom='20px';d.body.appendChild(b);

var im=d.createElement('div');im.id='m-iframe-modal';im.style.display='none';
im.innerHTML="<div style=\"display:flex;justify-content:space-between;padding:12px;background:var(--inBg);border-bottom:2px solid var(--border);color:var(--headTxt);font-weight:bold;font-size:14px;\"><span id=\"m-iframe-title\">MINI PAGE</span><span id=\"m-iframe-close\" style=\"cursor:pointer;background:#7f1d1d;padding:2px 8px;border-radius:4px;color:#fff;\">FECHAR [X]</span></div><iframe id=\"m-iframe-src\" style=\"flex:1;width:100%;height:100%;border:none;background:#fff;\"></iframe>";
d.body.appendChild(im);

d.getElementById('m-iframe-close').onclick=function(){im.style.display='none';d.getElementById('m-iframe-src').src='';};
function openIframe(url,t){d.getElementById('m-iframe-title').innerText=t;d.getElementById('m-iframe-src').src=url;im.style.display='flex';}

window.addEventListener('keydown',function(e){
    if(e.key==='F3'){e.preventDefault();e.stopPropagation();openIframe('https://saski.brisanet.net.br/','SASKI (F3)');}
    else if(e.key==='F4'){e.preventDefault();e.stopPropagation();openIframe('https://pastor.brisanet.net.br/#/wookie/home','PASTOR (F4)');}
},true);

var p=d.createElement('div');p.id='m-ui';p.style.display='none';
p.innerHTML="<div id=\"m-sidebar\"><div style=\"text-align:center;margin-bottom:12px;font-weight:bold;color:var(--headTxt);\">DASHBOARD</div><div id=\"side-reg\" class=\"side-item active\">\uD83D\uDCDD Registro</div><div id=\"side-net\" class=\"side-item\">\uD83D\uDCE1 Ger\xEAncia</div><div id=\"side-gb\" class=\"side-item\">\uD83D\uDC7B Ghostbu</div><div id=\"side-ai\" class=\"side-item\">\uD83E\uDD16 IA Groq</div><div id=\"side-vis\" class=\"side-item\">\uD83C\uDFA8 Visual</div></div>"+
"<div id=\"m-content-area\"><div id=\"m-head\"><span id=\"m-title-text\">Registro de Atendimento</span><span id=\"m-x\" style=\"cursor:pointer;color:var(--headTxt)\">[X]</span></div>"+
"<div id=\"content-main\" class=\"content-panel\"><div class=\"seg\"><input type=\"radio\" name=\"m-ct\" id=\"ct-tit\" value=\"titular\" checked><label for=\"ct-tit\">Titular</label><input type=\"radio\" name=\"m-ct\" id=\"ct-ter\" value=\"terceiro\"><label for=\"ct-ter\">Terceiro</label></div><input id=\"m-ter\" placeholder=\"Nome do Terceiro...\" style=\"display:none\"><div class=\"seg\"><input type=\"radio\" name=\"m-tc\" id=\"tc-all\" value=\"all\" checked><label for=\"tc-all\">Todos</label><input type=\"radio\" name=\"m-tc\" id=\"tc-ftth\" value=\"ftth\"><label for=\"tc-ftth\">FTTH</label><input type=\"radio\" name=\"m-tc\" id=\"tc-fwa\" value=\"fwa\"><label for=\"tc-fwa\">FWA</label></div><input id=\"m-sr\" placeholder=\"\uD83D\uDD0D Buscar motivo...\"><select id=\"m-sm\"></select><textarea id=\"m-msg\" rows=\"4\" placeholder=\"Mensagem de registro...\"></textarea><div id=\"tag-display\">\uD83C\uDFF7\uFE0F Interna: Nenhuma<br>\uD83D\uDE80 Externa: N\xE3o se aplica</div><div style=\"display:flex;justify-content:space-between;align-items:center;background:var(--inBg);padding:8px;border:1px solid var(--inBdr);border-radius:4px;margin-bottom:8px\"><div class=\"tw\">Ext<input type=\"checkbox\" id=\"m-ext\"><label class=\"tg\" for=\"m-ext\"></label></div><div class=\"tw\">Agd<input type=\"checkbox\" id=\"m-ag\"><label class=\"tg\" for=\"m-ag\"></label></div></div><textarea id=\"m-obs\" rows=\"1\" placeholder=\"Observa\xE7\xE3o (opcional)...\"></textarea><div style=\"display:flex;gap:6px;margin-bottom:6px;\"><button type=\"button\" id=\"m-saski\" class=\"util-btn\">SASKI [F3]</button><button type=\"button\" id=\"m-wookie\" class=\"util-btn\">PASTOR [F4]</button></div><button id=\"m-go\">FINALIZAR E REGISTRAR</button></div>"+
"<div id=\"content-net\" class=\"content-panel\" style=\"display:none;\"><div class=\"dash-grid\"><div class=\"dash-card\"><div class=\"dash-card-title\">\uD83D\uDD0C Estado Equipamento <span style=\"cursor:pointer\" id=\"btn-read-status\" title=\"Atualizar Status\">\uD83D\uDD04</span></div><div style=\"font-size:10px;color:var(--headTxt);\">Status:</div><div class=\"dash-val\" id=\"dash-st\">Desconhecido</div><div style=\"font-size:10px;color:var(--headTxt);margin-top:6px;\">\xDAltima Resposta:</div><div class=\"dash-val\" id=\"dash-lv\">--/--/---- --:--</div></div><div class=\"dash-card\"><div class=\"dash-card-title\">\uD83D\uDCE1 Diagn\xF3sticos</div><button type=\"button\" class=\"dash-btn\" id=\"btn-read-sinal\" style=\"padding:6px;font-size:10px;margin-bottom:6px;\">CONSULTAR SINAL</button><button type=\"button\" class=\"dash-btn\" id=\"btn-check-gerencia\" style=\"padding:6px;font-size:10px;background:var(--inBg);border:1px solid var(--inBdr);color:var(--text);\">VERIFICAR GER\xCANCIA</button></div></div><div class=\"dash-card\" style=\"margin-bottom:10px;\"><div class=\"dash-card-title\"><span>\uD83C\uDF10 Configura\xE7\xE3o Wi-Fi (Atual vs Novo)</span><span id=\"btn-sync-current-wifi\" style=\"cursor:pointer;color:var(--btnBorder);\" title=\"Ler Valores da Tela\">\uD83D\uDD04 Ler Atuais</span></div><div style=\"font-size:9.5px;margin-bottom:6px;color:var(--headTxt);\"><div>Atuais 2.4GHz: <b id=\"lbl-curr-24\" style=\"color:var(--text)\">N\xE3o lido</b></div><div>Atuais 5.8GHz: <b id=\"lbl-curr-58\" style=\"color:var(--text)\">N\xE3o lido</b></div></div><div class=\"dash-grid\" style=\"margin:0;\"><div><span style=\"font-size:10px;\">Novo 2.4G Banda:</span><select id=\"w-24-b\" class=\"cfg-sel\"><option value=\"\">-- Manter --</option><option>20MHz</option><option>40MHz</option></select></div><div><span style=\"font-size:10px;\">Novo 2.4G Canal:</span><select id=\"w-24-c\" class=\"cfg-sel\"><option value=\"\">-- Manter --</option><option>1</option><option>6</option><option>11</option></select></div><div><span style=\"font-size:10px;\">Novo 5.8G Banda:</span><select id=\"w-58-b\" class=\"cfg-sel\"><option value=\"\">-- Manter --</option><option>20MHz</option><option>40MHz</option><option>80MHz</option></select></div><div><span style=\"font-size:10px;\">Novo 5.8G Canal:</span><select id=\"w-58-c\" class=\"cfg-sel\"><option value=\"\">-- Manter --</option><option>36</option><option>40</option><option>44</option><option>48</option></select></div></div><div style=\"margin-top:8px;\"><button type=\"button\" class=\"dash-btn\" id=\"btn-save-wifi\" style=\"padding:8px;font-size:10px;\">\uD83D\uDCBE EXECUTAR: EDITAR \u2794 ALTERAR \u2794 SALVAR</button></div></div></div>"+
"<div id=\"content-gb\" class=\"content-panel\" style=\"display:none;\"><div id=\"gb-toast\">FASE CONCLU\xCDDA! \uD83C\uDF89</div><div id=\"gb-prize-banner\"></div><div class=\"game-layout\"><div class=\"game-left\"><div style=\"display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:4px\"><div id=\"gb-lives\" style=\"font-size:14px;letter-spacing:2px;\">\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F</div><div style=\"text-align:right\"><span style=\"font-weight:bold;color:var(--headTxt);font-size:12px\" id=\"gb-lvl-title\">N\xEDvel 1 / 300</span><span id=\"gb-max-unlocked\" style=\"display:block;font-size:9px;color:var(--text)\">Desbloqueado: N\xEDvel 1</span></div></div><div style=\"display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:6px\"><select id=\"gb-sel-diff\" class=\"cfg-sel\" style=\"width:130px;margin:0!important;padding:2px 4px!important;\"><option value=\"facil\">F\xE1cil (5x5)</option><option value=\"medio\">M\xE9dio (7x7)</option><option value=\"dificil\">Dif\xEDcil (8x8)</option><option value=\"expert\">Especialista (9x9)</option></select><div style=\"display:flex;gap:4px;\"><button type=\"button\" id=\"gb-prev\" class=\"gb-nav-btn\">\u25C0 Ant</button><button type=\"button\" id=\"gb-next\" class=\"gb-nav-btn\" disabled>Pr\xF3x \u25B6</button></div></div><div id=\"ghostbu-board-wrapper\" style=\"width:100%;display:flex;justify-content:center;align-items:center;margin-bottom:6px;\"><div id=\"ghostbu-board\"></div></div><div style=\"display:flex;gap:6px;\"><button type=\"button\" id=\"gb-clear\" class=\"gb-nav-btn\" style=\"flex:1\">REINICIAR</button><button type=\"button\" id=\"gb-autox\" class=\"gb-nav-btn\" style=\"flex:1;color:#4ade80\">AUTO-X: ON</button></div></div><div class=\"game-rules-box\"><div class=\"rules-title\">\uD83D\uDCDC Regras do Ghostbu</div><b>1. Um por Regi\xE3o:</b> Cada cor possui exatamente 1 fantasma.<br><b>2. Sem Toque:</b> Fantasmas n\xE3o podem encostar (nem em diagonal).<br><b>3. Linha e Coluna:</b> Apenas 1 fantasma por linha e coluna.<br><br><div class=\"rules-title\">\uD83C\uDFAE Controles</div>\u2022 <b>Toque Simples:</b> Marca ou remove o 'X' (sem risco de vida).<br>\u2022 <b>Arrastar sobre 'X':</b> Apaga marca\xE7\xF5es de 'X' continuamente at\xE9 soltar.<br>\u2022 <b>Arrastar no vazio:</b> Preenche com 'X'.<br>\u2022 <b>Duplo Toque:</b> Posiciona fantasma (\uD83D\uDC7B).<br>\u2022 <b>Vidas:</b> Errar o fantasma desconta 1 \u2764\uFE0F. Com 3 erros, a fase reinicia.</div></div></div>"+
"<div id=\"content-ai\" class=\"content-panel\" style=\"display:none;\"><input type=\"text\" id=\"groq-key\" placeholder=\"API Key Groq (gsk_...)\" style=\"margin-bottom:8px;\"><textarea id=\"groq-chat\" rows=\"6\" placeholder=\"Cole o hist\xF3rico do chat bruto aqui...\"></textarea><button type=\"button\" id=\"groq-btn\" class=\"ia-btn\">GERAR RELATO T\xC9CNICO</button><div id=\"groq-res-box\" style=\"display:none;margin-top:8px;\"><span style=\"font-size:10px;color:var(--headTxt);\">Resultado:</span><textarea id=\"groq-out\" rows=\"6\" readonly></textarea><div style=\"display:flex;gap:4px;\"><button type=\"button\" id=\"groq-copy\" class=\"util-btn\">COPIAR</button><button type=\"button\" id=\"groq-use\" class=\"util-btn\" style=\"background:var(--btnBg)!important;color:#fff!important;\">USAR NO REGISTRO</button></div></div></div>"+
"<div id=\"content-vis\" class=\"content-panel\" style=\"display:none;\"><span style=\"font-size:10px;color:var(--headTxt);\">Tema:</span><select id=\"m-sel-thm\" class=\"cfg-sel\"><option value=\"black_red\">Preto/Vermelho</option><option value=\"light_basic\">Claro B\xE1sico</option><option value=\"dark_basic\">Escuro B\xE1sico</option><option value=\"white_blue\">Branco/Azul</option><option value=\"purple_black\">Roxo/Preto</option><option value=\"green_yellow\">Verde/Amarelo</option><option value=\"black_blue\">Preto/Azul</option><option value=\"black_yellow_rays\">Preto/Amarelo\u26A1</option><option value=\"orange_5g\">Laranja 5G</option><option value=\"custom\">ARGB Custom</option></select><span style=\"font-size:10px;color:var(--headTxt);\">Cor da Fonte:</span><select id=\"m-sel-tclr\" class=\"cfg-sel\"><option value=\"#f1f5f9\">Branca / Clara</option><option value=\"#0f172a\">Preta / Escura</option></select><span style=\"font-size:10px;color:var(--headTxt);\">\xCDcone do Bot\xE3o:</span><select id=\"m-sel-icn\" class=\"cfg-sel\"><option value=\"sol\">Sol \u2600\uFE0F</option><option value=\"lua\">Lua \uD83C\uDF19</option><option value=\"mar\">Mar \uD83C\uDF0A</option><option value=\"estrelas\">Estrelas \u2728</option><option value=\"nuvem\">Nuvem \u2601\uFE0F</option><option value=\"akatsuki\">Nuvem Akatsuki \u2601\uFE0F</option></select><span style=\"font-size:10px;color:var(--headTxt);\">Fonte:</span><select id=\"m-sel-fnt\" class=\"cfg-sel\" style=\"margin-bottom:8px!important;\"><option value=\"cyber\">Cyber</option><option value=\"old\">Retro</option><option value=\"common\">Comum</option><option value=\"signature\">Assinatura</option><option value=\"cloister\">Cloister Black (G\xF3tica)</option></select><div id=\"m-custom-colors\" style=\"display:none;gap:6px;align-items:center;background:var(--inBg);padding:6px;border:1px solid var(--inBdr);border-radius:4px;\"><span style=\"font-size:9px;\">Fundo:</span><input type=\"color\" id=\"m-clr-bg\" value=\""+savedBg+"\" style=\"width:30px;height:20px;padding:0;margin:0;cursor:pointer;\"><span style=\"font-size:9px;\">Borda:</span><input type=\"color\" id=\"m-clr-bdr\" value=\""+savedBdr+"\" style=\"width:30px;height:20px;padding:0;margin:0;cursor:pointer;\"></div></div></div>";
d.body.appendChild(p);

applyLiveStyle(savedThm,savedIcn,savedFnt,savedTxtClr,savedBg,savedBdr);

var stThm=d.getElementById('m-sel-thm'),stIcn=d.getElementById('m-sel-icn'),stFnt=d.getElementById('m-sel-fnt'),stTClr=d.getElementById('m-sel-tclr'),cColors=d.getElementById('m-custom-colors'),cBgEl=d.getElementById('m-clr-bg'),cBdrEl=d.getElementById('m-clr-bdr');
if(savedThm==='custom'&&cColors)cColors.style.display='flex';
if(stTClr)stTClr.value=(savedTxtClr==='#0f172a'?'#0f172a':'#f1f5f9');
if(stThm){stThm.onchange=function(){cColors.style.display=this.value==='custom'?'flex':'none';applyLiveStyle(this.value,stIcn.value,stFnt.value,stTClr.value,cBgEl.value,cBdrEl.value);};}
if(stIcn){stIcn.onchange=function(){applyLiveStyle(stThm.value,this.value,stFnt.value,stTClr.value,cBgEl.value,cBdrEl.value);};}
if(stFnt){stFnt.onchange=function(){applyLiveStyle(stThm.value,stIcn.value,this.value,stTClr.value,cBgEl.value,cBdrEl.value);};}
if(stTClr){stTClr.onchange=function(){applyLiveStyle(stThm.value,stIcn.value,stFnt.value,this.value,cBgEl.value,cBdrEl.value);};}
if(cBgEl){cBgEl.oninput=function(){applyLiveStyle('custom',stIcn.value,stFnt.value,stTClr.value,this.value,cBdrEl.value);};}
if(cBdrEl){cBdrEl.oninput=function(){applyLiveStyle('custom',stIcn.value,stFnt.value,stTClr.value,cBgEl.value,this.value);};}

function switchNav(id,title){
    var navs=['main','net','gb','ai','vis'];
    for(var i=0;i<navs.length;i++){
        var k=navs[i];
        d.getElementById('content-'+k).style.display=id===k?'block':'none';
        d.getElementById('side-'+(k==='main'?'reg':k)).classList.toggle('active',id===k);
    }
    d.getElementById('m-title-text').innerText=title;
    if(id==='gb'&&levelData)renderBoard();
}

d.getElementById('side-reg').onclick=function(){switchNav('main','Registro de Atendimento');};
d.getElementById('side-net').onclick=function(){switchNav('net','Gerência e Equipamento');};
d.getElementById('side-gb').onclick=function(){switchNav('gb','Ghostbu Puzzle (300 Níveis)');};
d.getElementById('side-ai').onclick=function(){switchNav('ai','Assistente IA (Groq)');};
d.getElementById('side-vis').onclick=function(){switchNav('vis','Configurações Visuais');};

d.getElementById('m-saski').onclick=function(){openIframe('https://saski.brisanet.net.br/','SASKI (F3)');};
d.getElementById('m-wookie').onclick=function(){openIframe('https://pastor.brisanet.net.br/#/wookie/home','PASTOR (F4)');};

d.getElementById('btn-read-status').onclick=function(){
    var st=d.querySelector('.status-infor'),lv=d.querySelector('.last-verification');
    if(st)d.getElementById('dash-st').innerText=st.innerText.trim()||'N/A';
    if(lv)d.getElementById('dash-lv').innerText=lv.innerText.trim()||'N/A';
};

d.getElementById('btn-read-sinal').onclick=function(){
    var btn=d.querySelector('[data-testid="btn-Consultar sinal"]')||d.querySelector('button ion-icon#ion-icon-radio')?.closest('button');
    if(btn){btn.click();this.innerText="Consultando...";setTimeout(()=>{this.innerText="CONSULTAR SINAL";},2000);}
};

d.getElementById('btn-check-gerencia').onclick=function(){
    var btn=null,spans=Array.from(d.querySelectorAll('span, button'));
    for(var i=0;i<spans.length;i++){
        if((spans[i].textContent||'').toLowerCase().indexOf('verificar gerência')!==-1){
            btn=spans[i].closest('button')||spans[i];
            break;
        }
    }
    if(btn){btn.click();this.innerText="Verificando...";setTimeout(()=>{this.innerText="VERIFICAR GERÊNCIA";},2000);}
};

function syncCurrentWifi(){
    var items=Array.from(d.querySelectorAll('.ion-select-item__content, ion-select-item, [data-testid="ion-select-item"]')),
        vals=items.map(function(el){return(el.textContent||'').trim();}).filter(Boolean);
    if(vals.length>=2)d.getElementById('lbl-curr-24').innerText='Banda: '+vals[0]+' | Canal: '+vals[1];
    if(vals.length>=4)d.getElementById('lbl-curr-58').innerText='Banda: '+vals[2]+' | Canal: '+vals[3];
}
d.getElementById('btn-sync-current-wifi').onclick=syncCurrentWifi;

d.getElementById('btn-save-wifi').onclick=async function(){
    var btn=this,orig=btn.innerText;
    btn.disabled=true;
    btn.innerText='1/3 CLICANDO EM EDITAR...';
    var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
    var isVis=function(el){
        if(!el)return false;
        var st=window.getComputedStyle(el);
        return st.display!=='none'&&st.visibility!=='hidden'&&el.offsetWidth>0;
    };
    var clickElement=function(el){
        if(!el)return;
        try{el.scrollIntoView({behavior:'instant',block:'center'});}catch(e){}
        var o={bubbles:true,cancelable:true,view:window};
        el.dispatchEvent(new MouseEvent('mousedown',o));
        el.dispatchEvent(new MouseEvent('mouseup',o));
        el.click();
    };
    var editBtn=null,allSpans=Array.from(d.querySelectorAll('span, button, div'));
    for(var i=0;i<allSpans.length;i++){
        var t=(allSpans[i].textContent||'').trim().toLowerCase();
        if(t==='editar'&&isVis(allSpans[i])){
            editBtn=allSpans[i].closest('button')||allSpans[i];
            break;
        }
    }
    if(editBtn){clickElement(editBtn);await sleep(800);}
    btn.innerText='2/3 ALTERANDO CONFIGURAÇÕES...';
    async function selectOptionInIonSelect(selectContainer,targetValue){
        if(!selectContainer||!targetValue)return;
        var closeBtn=selectContainer.querySelector('[data-testid="ion-icon-close"]')||selectContainer.querySelector('#ion-icon-close')||selectContainer.querySelector('svg#ion-icon-close');
        if(closeBtn){clickElement(closeBtn.closest('div')||closeBtn);await sleep(300);}
        var inputOrTrigger=selectContainer.querySelector('input')||selectContainer.querySelector('.ion-select-container')||selectContainer;
        clickElement(inputOrTrigger);
        await sleep(500);
        var options=Array.from(d.querySelectorAll('.cdk-overlay-pane li, .cdk-overlay-container [role="option"], ion-select-popover ion-item, .ion-select-item, [class*="select-option"], [class*="option-item"]')).filter(isVis);
        var match=options.find(function(el){return(el.textContent||'').trim().toLowerCase()===targetValue.toLowerCase();})||options.find(function(el){return(el.textContent||'').trim().toLowerCase().indexOf(targetValue.toLowerCase())!==-1;});
        if(match){clickElement(match);await sleep(400);}
        else{var backdrop=d.querySelector('.cdk-overlay-backdrop');if(backdrop)clickElement(backdrop);}
        await sleep(300);
    }
    var selects=Array.from(d.querySelectorAll('.ion-select, [data-testid="ion-select"]')).filter(isVis);
    var v24b=d.getElementById('w-24-b').value,v24c=d.getElementById('w-24-c').value,v58b=d.getElementById('w-58-b').value,v58c=d.getElementById('w-58-c').value;
    if(selects.length>=2){
        if(v24b&&selects[0])await selectOptionInIonSelect(selects[0],v24b);
        if(v24c&&selects[1])await selectOptionInIonSelect(selects[1],v24c);
    }
    if(selects.length>=4){
        if(v58b&&selects[2])await selectOptionInIonSelect(selects[2],v58b);
        if(v58c&&selects[3])await selectOptionInIonSelect(selects[3],v58c);
    }
    await sleep(600);
    btn.innerText='3/3 SALVANDO...';
    var saveBtn=null,spansSave=Array.from(d.querySelectorAll('span, button'));
    for(var k=0;k<spansSave.length;k++){
        var txtS=(spansSave[k].textContent||'').trim().toLowerCase();
        if(txtS==='salvar'&&isVis(spansSave[k])){saveBtn=spansSave[k].closest('button')||spansSave[k];break;}
    }
    if(saveBtn){clickElement(saveBtn);btn.innerText='SALVO COM SUCESSO!';}
    else{btn.innerText='CONCLUÍDO!';}
    setTimeout(function(){
        syncCurrentWifi();btn.innerText=orig;btn.disabled=false;d.getElementById('m-ui').style.display='none';
    },2500);
};

/* LÓGICA DO JOGO GHOSTBU */
var COLORS=['#1e3a5f','#3b1f50','#144a3e','#4a3b14','#4a1420','#2c3e50','#4338ca','#1e40af','#065f46','#854d0e','#991b1b','#581c87'];
function lcg(s){
    return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};
}

var diffModes={
    facil:{size:5,maxG:4,salt:1000},
    medio:{size:7,maxG:6,salt:3000},
    dificil:{size:8,maxG:8,salt:5000},
    expert:{size:9,maxG:999,salt:7000}
};

var curDiff=ls.getItem('ghostbu_cur_diff')||'facil';
function getMaxLvl(m){return parseInt(ls.getItem('ghostbu_prog_'+m)||'1',10);}
function setMaxLvl(m,l){ls.setItem('ghostbu_prog_'+m,l);}

var curLevel=getMaxLvl(curDiff),
    boardState=[],
    levelData=null,
    autoX=true,
    curLives=3,
    isDragging=false,
    dragAction=null,
    lastTapTime=0,
    lastTapPos="";

function renderLives(){
    var h="";
    for(var i=0;i<3;i++)h+=i<curLives?'\u2764\uFE0F':'\uD83D\uDDA4';
    d.getElementById('gb-lives').innerHTML=h;
}

function checkMilestoneReward(mode, lvl){
    var won=false;
    if(mode==='facil'&&lvl%100===0){won=true;}
    else if(mode==='medio'&&(lvl%90===0||lvl===300)){won=true;}
    else if(mode==='dificil'&&(lvl%80===0||lvl===300)){won=true;}
    else if(mode==='expert'&&lvl%50===0){won=true;}
    
    var banner=d.getElementById('gb-prize-banner');
    if(won){
        banner.style.display='block';
        banner.innerText='🎉 VOCE GANHOU UM BRINDE! ENVIE UM PRINT PARA DANIEL.AQUINO DESSA MENSAGEM E VA ATÉ A P/A DO DESENVOLVEDOR PARA RECEBER SEU PREMIO.';
    } else {
        banner.style.display='none';
        banner.innerText='';
    }
}

function generateLevel(lvl,mK){
    var conf=diffModes[mK]||diffModes.facil,
        prng=lcg((lvl*7919+conf.salt)>>>0),
        size=conf.size;
    var queens=[];
    for(var tries=0;tries<2000;tries++){
        queens=[];
        var cols=[...Array(size).keys()];
        for(var r=0;r<size;r++){
            var validCols=cols.filter(function(c){
                for(var pr=0;pr<r;pr++){
                    var pc=queens[pr];
                    if(Math.abs(pr-r)<=1&&Math.abs(pc-c)<=1)return false;
                }
                return true;
            });
            if(validCols.length===0)break;
            var chosen=validCols[Math.floor(prng()*validCols.length)];
            queens.push(chosen);
            cols=cols.filter(function(c){return c!==chosen;});
        }
        if(queens.length===size)break;
    }
    if(queens.length!==size){
        queens=[];
        for(var i=0;i<size;i++)queens.push((i*2+1)%size);
    }
    var regions=[...Array(size)].map(function(){return Array(size).fill(-1);});
    queens.forEach(function(c,r){regions[r][c]=r;});
    var unassigned=size*size-size;
    while(unassigned>0){
        var changed=false;
        for(var r=0;r<size;r++){
            for(var c=0;c<size;c++){
                if(regions[r][c]===-1){
                    var neighbors=[];
                    if(r>0&®ions[r-1][c]!==-1)neighbors.push(regions[r-1][c]);
                    if(r<size-1&®ions[r+1][c]!==-1)neighbors.push(regions[r+1][c]);
                    if(c>0&®ions[r][c-1]!==-1)neighbors.push(regions[r][c-1]);
                    if(c<size-1&®ions[r][c+1]!==-1)neighbors.push(regions[r][c+1]);
                    if(neighbors.length>0){
                        var reg=neighbors[Math.floor(prng()*neighbors.length)];
                        var regCount=regions.flat().filter(function(x){return x===reg;}).length;
                        if(regCount<conf.maxG||unassigned<size*1.5){
                            regions[r][c]=reg;
                            unassigned--;
                            changed=true;
                        }
                    }
                }
            }
        }
        if(!changed){
            for(var r=0;r<size;r++){
                for(var c=0;c<size;c++){
                    if(regions[r][c]===-1){
                        var nb=[[-1,0],[1,0],[0,-1],[0,1]].map(function(dr){return[r+dr[0],c+dr[1]];}).filter(function(pt){return pt[0]>=0&&pt[0]<size&&pt[1]>=0&&pt[1]<size&®ions[pt[0]][pt[1]]!==-1;});
                        if(nb.length>0){
                            regions[r][c]=regions[nb[0][0]][nb[0][1]];
                            unassigned--;
                        }
                    }
                }
            }
        }
    }
    return{size:size,regions:regions,solution:queens};
}

var toastEl=d.getElementById('gb-toast');
function showToast(msg){
    toastEl.innerText=msg;
    toastEl.style.display='block';
    setTimeout(function(){toastEl.style.display='none';},2000);
}

function updateNavControls(){
    var maxLvl=getMaxLvl(curDiff);
    d.getElementById('gb-lvl-title').innerText='Nível '+curLevel+' / 300';
    d.getElementById('gb-max-unlocked').innerText='Desbloqueado: Nível '+maxLvl;
    d.getElementById('gb-prev').disabled=(curLevel<=1);
    d.getElementById('gb-next').disabled=(curLevel>=maxLvl||curLevel>=300);
}

function loadLevel(lvl,mK){
    curLevel=lvl;
    curDiff=mK;
    ls.setItem('ghostbu_cur_diff',curDiff);
    levelData=generateLevel(lvl,mK);
    curLives=3;
    renderLives();
    d.getElementById('gb-sel-diff').value=mK;
    updateNavControls();
    checkMilestoneReward(curDiff, curLevel);
    boardState=[...Array(levelData.size)].map(function(){return Array(levelData.size).fill(0);});
    renderBoard();
}

function renderBoard(){
    var bEl=d.getElementById('ghostbu-board');
    if(!bEl||!levelData)return;
    bEl.innerHTML='';
    var N=levelData.size;
    bEl.style.gridTemplateColumns='repeat('+N+', 1fr)';
    var boardDim=Math.min(270, d.getElementById('content-gb').clientWidth-20);
    bEl.style.width=boardDim+'px';
    bEl.style.height=boardDim+'px';
    var cellPixel=Math.floor(boardDim/N)-4;
    for(var r=0;r<N;r++){
        for(var c=0;c<N;c++){
            var cell=d.createElement('div');
            cell.className='gb-cell';
            cell.style.width=cellPixel+'px';
            cell.style.height=cellPixel+'px';
            cell.style.backgroundColor=COLORS[levelData.regions[r][c]%COLORS.length];
            cell.dataset.r=r;
            cell.dataset.c=c;
            var val=boardState[r][c];
            if(val===1){cell.innerHTML='👻';cell.classList.add('has-ghost');}
            else if(val===2){cell.innerHTML='✕';cell.classList.add('has-x');}
            
            cell.onmousedown=function(e){
                if(e.button===0){
                    isDragging=true;
                    var cr=parseInt(this.dataset.r),cc=parseInt(this.dataset.c);
                    dragAction=(boardState[cr][cc]===2)?'removeX':'setX';
                    handleCellTap(cr,cc);
                }
            };
            cell.onmouseenter=function(){
                if(isDragging){
                    var r=parseInt(this.dataset.r),c=parseInt(this.dataset.c);
                    if(dragAction==='removeX'&&boardState[r][c]===2){
                        boardState[r][c]=0;
                        renderBoard();
                    }else if(dragAction==='setX'&&boardState[r][c]===0){
                        boardState[r][c]=2;
                        renderBoard();
                    }
                }
            };
            cell.oncontextmenu=function(e){
                e.preventDefault();
                var r=parseInt(this.dataset.r),c=parseInt(this.dataset.c);
                boardState[r][c]=boardState[r][c]===2?0:2;
                renderBoard();
            };
            bEl.appendChild(cell);
        }
    }
    validateRules();
}

d.addEventListener('mouseup',function(){
    isDragging=false;
    dragAction=null;
});

function handleCellTap(r,c){
    var now=Date.now(),pos=r+','+c;
    if(now-lastTapTime<350&&lastTapPos===pos){
        doubleTapCell(r,c);
        lastTapTime=0;
        lastTapPos="";
    }else{
        lastTapTime=now;
        lastTapPos=pos;
        setTimeout(function(){
            if(lastTapPos===pos){
                singleTapCell(r,c);
                lastTapPos="";
            }
        },360);
    }
}

function singleTapCell(r,c){
    if(boardState[r][c]===0)boardState[r][c]=2;
    else if(boardState[r][c]===2)boardState[r][c]=0;
    renderBoard();
}

function doubleTapCell(r,c){
    if(boardState[r][c]===1){
        boardState[r][c]=0;
        renderBoard();
        return;
    }
    if(levelData.solution[r]===c){
        boardState[r][c]=1;
        if(autoX)applyAutoX(r,c);
        renderBoard();
        checkWinCondition();
    }else{
        curLives--;
        renderLives();
        showToast('ERROU! -1 ❤️');
        var target=d.querySelector('.gb-cell[data-r="'+r+'"][data-c="'+c+'"]');
        if(target){
            target.classList.add('invalid');
            setTimeout(function(){target.classList.remove('invalid');},600);
        }
        if(curLives<=0){
            setTimeout(function(){
                showToast('FIM DE JOGO! REINICIANDO...');
                boardState=[...Array(levelData.size)].map(function(){return Array(levelData.size).fill(0);});
                curLives=3;
                renderLives();
                renderBoard();
            },800);
        }
    }
}

function applyAutoX(r,c){
    var N=levelData.size;
    for(var dr=-1;dr<=1;dr++){
        for(var dc=-1;dc<=1;dc++){
            if(dr===0&&dc===0)continue;
            var nr=r+dr,nc=c+dc;
            if(nr>=0&&nr<N&&nc>=0&&nc<N){
                if(boardState[nr][nc]===0)boardState[nr][nc]=2;
            }
        }
    }
}

function validateRules(){
    var N=levelData.size;
    var cells=d.querySelectorAll('.gb-cell');
    cells.forEach(function(el){el.classList.remove('invalid');});
    var ghostPositions=[];
    for(var r=0;r<N;r++){
        for(var c=0;c<N;c++){
            if(boardState[r][c]===1)ghostPositions.push({r:r,c:c,reg:levelData.regions[r][c]});
        }
    }
    var invalidSet=new Set();
    for(var i=0;i<ghostPositions.length;i++){
        for(var j=i+1;j<ghostPositions.length;j++){
            var g1=ghostPositions[i],g2=ghostPositions[j];
            var sameRow=g1.r===g2.r,sameCol=g1.c===g2.c,sameReg=g1.reg===g2.reg,
                touches=Math.abs(g1.r-g2.r)<=1&&Math.abs(g1.c-g2.c)<=1;
            if(sameRow||sameCol||sameReg||touches){
                invalidSet.add(g1.r+','+g1.c);
                invalidSet.add(g2.r+','+g2.c);
            }
        }
    }
    invalidSet.forEach(function(pos){
        var coords=pos.split(',');
        var target=d.querySelector('.gb-cell[data-r="'+coords[0]+'"][data-c="'+coords[1]+'"]');
        if(target)target.classList.add('invalid');
    });
}

function checkWinCondition(){
    var N=levelData.size;
    var ghosts=[];
    for(var r=0;r<N;r++){
        for(var c=0;c<N;c++){
            if(boardState[r][c]===1)ghosts.push({r:r,c:c,reg:levelData.regions[r][c]});
        }
    }
    if(ghosts.length!==N)return;
    var rows=new Set(),cols=new Set(),regs=new Set();
    for(var i=0;i<ghosts.length;i++){
        var g1=ghosts[i];
        rows.add(g1.r);
        cols.add(g1.c);
        regs.add(g1.reg);
        for(var j=i+1;j<ghosts.length;j++){
            var g2=ghosts[j];
            if(Math.abs(g1.r-g2.r)<=1&&Math.abs(g1.c-g2.c)<=1)return;
        }
    }
    if(rows.size===N&&cols.size===N&®s.size===N){
        showToast('NÍVEL CONCLUÍDO! PRÓXIMO LIBERADO!');
        var maxLvl=getMaxLvl(curDiff);
        if(curLevel>=maxLvl&&curLevel<300){
            maxLvl=curLevel+1;
            setMaxLvl(curDiff,maxLvl);
        }
        updateNavControls();
        setTimeout(function(){
            if(curLevel<300)loadLevel(curLevel+1,curDiff);
            else showToast('PARABÉNS! ZEROU TODAS AS 300 FASES DESTA DIFICULDADE!');
        },1200);
    }
}

d.getElementById('gb-sel-diff').onchange=function(){loadLevel(getMaxLvl(this.value),this.value);};
d.getElementById('gb-prev').onclick=function(){if(curLevel>1)loadLevel(curLevel-1,curDiff);};
d.getElementById('gb-next').onclick=function(){if(curLevel<getMaxLvl(curDiff)&&curLevel<300)loadLevel(curLevel+1,curDiff);};
d.getElementById('gb-clear').onclick=function(){
    boardState=[...Array(levelData.size)].map(function(){return Array(levelData.size).fill(0);});
    curLives=3;
    renderLives();
    renderBoard();
};
d.getElementById('gb-autox').onclick=function(){
    autoX=!autoX;
    this.innerText=autoX?'AUTO-X: ON':'AUTO-X: OFF';
    this.style.color=autoX?'#4ade80':'#f87171';
};

loadLevel(curLevel,curDiff);

b.onclick=function(){p.style.display=p.style.display==='none'?'flex':'none';};
d.getElementById('m-x').onclick=function(){p.style.display='none';};

var gk=ls.getItem('groq_api_key');
if(gk)d.getElementById('groq-key').value=gk;

d.getElementById('groq-btn').onclick=async function(){
    var apiKey=d.getElementById('groq-key').value.trim(),chatText=d.getElementById('groq-chat').value.trim();
    if(!apiKey||!chatText)return;
    ls.setItem('groq_api_key',apiKey);
    var btn=this,oldTxt=btn.innerText;
    btn.innerText='⏳ PROCESSANDO IA...';
    btn.disabled=true;
    d.getElementById('groq-res-box').style.display='block';
    d.getElementById('groq-out').value='Analisando...';
    var prompt='Você é um sistema automatizado de Documentação Técnica para Call Center de Suporte. Seu único trabalho é ler históricos de chats de atendimento e gerar um RELATO TÉCNICO EM PARÁGRAFO ÚNICO para o histórico do chamado.\\n\\nRegras absolutas:\\n1. ANONIMATO TOTAL: Remova nomes de clientes, atendentes, telefones, e-mails, números de documentos ou CPFs. Refira-se aos envolvidos apenas como "O cliente" e "O suporte".\\n2. FOCO TÉCNICO: Narre em terceira pessoa o sintoma técnico relatado, os testes ou diagnósticos feitos e a solução final aplicada.\\n3. FORMATO: Escreva em um único parágrafo contínuo, sem tópicos, sem traços (-), sem asteriscos (*) e sem quebras de linha. Responda apenas com o resumo técnico, sem mensagens adicionais ou introduções de IA.';
    try{
        var res=await fetch('https://api.groq.com/openai/v1/chat/completions',{
            method:'POST',
            headers:{'Authorization':'Bearer '+apiKey,'Content-Type':'application/json'},
            body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:prompt},{role:'user',content:'Gere o relato técnico deste chat:\\n\\n'+chatText}],temperature:0.1})
        });
        var data=await res.json();
        d.getElementById('groq-out').value=data.choices?.[0]?.message?.content?.trim()||'Erro na resposta';
    }catch(e){d.getElementById('groq-out').value='Erro de rede: '+e.message;}
    btn.innerText=oldTxt;
    btn.disabled=false;
};

d.getElementById('groq-copy').onclick=function(){
    navigator.clipboard.writeText(d.getElementById('groq-out').value);
    var btn=this,o=btn.innerText;
    btn.innerText='COPIADO!';
    setTimeout(function(){btn.innerText=o;},2000);
};

d.getElementById('groq-use').onclick=function(){
    setVal(d.getElementById('m-msg'),d.getElementById('groq-out').value);
    d.getElementById('side-reg').click();
};

function renderOpts(){
    var q=(d.getElementById('m-sr').value||'').toLowerCase(),
        tc=d.querySelector('input[name="m-tc"]:checked').value,
        sel=d.getElementById('m-sm');
    sel.innerHTML='<option value="">-- Selecione o Motivo --</option>';
    base.forEach(function(item,i){
        var str=(item.titulo+' '+item.servico+' '+item.mensagem).toLowerCase();
        if(tc!=='all'&&str.indexOf(tc)===-1)return;
        if(!q||str.indexOf(q)!==-1)sel.innerHTML+='<option value="'+i+'">'+item.titulo+'</option>';
    });
}
renderOpts();

d.getElementById('m-sr').oninput=renderOpts;
d.getElementsByName('m-tc').forEach(function(r){
    r.onchange=function(){
        renderOpts();
        var v=d.getElementById('m-sm').value;
        if(v!=='')updTag(base[parseInt(v)]);
    };
});

d.getElementsByName('m-ct').forEach(function(r){
    r.onchange=function(e){
        d.getElementById('m-ter').style.display=e.target.value==='terceiro'?'block':'none';
    };
});

function updTag(item){
    if(!item)return;
    var ext=d.getElementById('m-ext').checked,
        iTag=item.etiqueta||item.titulo,
        eTag=item.etiqueta_externo||iTag,
        srv=item.servico||"Reparo Físico";
    d.getElementById('tag-display').innerHTML=ext?`🏷️ Interna: <b>${iTag}</b><br>🚀 Externa: <b>${eTag} (${srv.toLowerCase()})</b>`:`🏷️ Interna: <b>${iTag}</b><br>🚀 Externa: <i>Não se aplica</i>`;
}

d.getElementById('m-sm').onchange=function(){
    var v=this.value;
    if(v!==''){
        var it=base[parseInt(v)];
        d.getElementById('m-msg').value=it.mensagem||'';
        d.getElementById('m-ext').checked=it.externo;
        updTag(it);
    }else{
        d.getElementById('m-msg').value='';
        d.getElementById('tag-display').innerHTML='🏷️ Interna: Nenhuma<br>🚀 Externa: Não se aplica';
        d.getElementById('m-ext').checked=false;
    }
};

d.getElementById('m-ext').onchange=function(){
    var v=d.getElementById('m-sm').value;
    if(v!=='')updTag(base[parseInt(v)]);
};

function normStr(s){
    return(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ');
}

function setVal(el,val){
    if(!el)return;
    try{el.focus();}catch(e){}
    var proto=el.tagName.toLowerCase()==='textarea'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype,
        setter=Object.getOwnPropertyDescriptor(proto,'value')?.set;
    if(setter)setter.call(el,val);
    else el.value=val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
}

function processTags(item,cb){
    var tag=item?(item.etiqueta||item.titulo):'';
    if(!tag)return cb?.();
    var pb=d.querySelector('nz-tag.editable-tag, i.anticon-plus')?.closest('nz-tag')||d.querySelector('.editable-tag');
    pb?.click();
    var att=0,int1=setInterval(function(){
        if(++att>=20||d.querySelector('#tags, nz-select[id="tags"]')){
            clearInterval(int1);
            var ts=d.querySelector('#tags, nz-select[id="tags"]')||d.querySelector('.ant-modal-content nz-select');
            ts?.querySelector('.ant-select-selection')?.click();
            var inp=ts?.querySelector('input');
            if(inp)setVal(inp,tag);
            setTimeout(function(){
                var panes=d.querySelectorAll('.cdk-overlay-pane'),p=panes[panes.length-1],tg=normStr(tag),match=null;
                if(p){
                    for(var k=0;k<p.querySelectorAll('li').length;k++){
                        var o=p.querySelectorAll('li')[k];
                        if(o.offsetWidth>0&&normStr(o.innerText||o.textContent).indexOf(tg)!==-1){match=o;break;}
                    }
                }
                if(match){
                    try{match.scrollIntoView({block:'nearest'});}catch(e){}
                    match.click();
                }
                setTimeout(function(){
                    var btns=Array.from(d.querySelectorAll('.ant-modal-content button')),
                        cBtn=btns.find(function(b){return b.textContent.toLowerCase().indexOf('concluir')!==-1;});
                    if(cBtn){cBtn.disabled=false;cBtn.click();}
                    if(cb)setTimeout(cb,1000);
                },800);
            },1500);
        }
    },200);
}

function selOpt(idx,txt,isM,cb,cnt){
    var c=cnt||d,att=0,intv=setInterval(function(){
        att++;
        var ss=Array.from(c.querySelectorAll('nz-select')).filter(function(e){return e.offsetWidth>0;});
        if(ss[idx]){
            clearInterval(intv);
            (ss[idx].querySelector('.ant-select-selection, .ant-select-selection__placeholder')||ss[idx]).click();
            setTimeout(function(){
                var inp=ss[idx].querySelector('input');
                if(inp&&txt)setVal(inp,txt);
                setTimeout(function(){
                    var panes=d.querySelectorAll('.cdk-overlay-pane'),p=panes[panes.length-1],tg=normStr(txt),m=null;
                    if(p){
                        for(var k=0;k<p.querySelectorAll('li').length;k++){
                            var o=p.querySelectorAll('li')[k];
                            if(o.offsetWidth>0&&normStr(o.textContent).indexOf(tg)!==-1){
                                try{o.scrollIntoView({block:'nearest'});}catch(e){}
                                m=o;break;
                            }
                        }
                    }
                    if(m){
                        m.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true,view:window}));
                        m.click();
                        m.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true,view:window}));
                        if(inp)inp.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,cancelable:true,key:'Enter',keyCode:13}));
                    }
                    if(isM)d.querySelectorAll('.cdk-overlay-backdrop').forEach(function(b){b.click();});
                    setTimeout(function(){cb?.();},800);
                },1500);
            },500);
        }else if(att>=25){clearInterval(intv);cb?.();}
    },200);
}

function clickBtnByText(txt){
    var tg=normStr(txt),allEls=d.querySelectorAll('button, span, a, div');
    for(var i=0;i<allEls.length;i++){
        if(normStr(allEls[i].textContent).indexOf(tg)!==-1&&allEls[i].offsetWidth>0){
            try{(allEls[i].closest('button')||allEls[i]).click();}catch(e){}
            break;
        }
    }
}

function handleExternalFlow(item,isAgd){
    var fw=d.getElementById('forward')||d.querySelector('.item.forward, img.forward')?.closest('div.item')||Array.from(d.querySelectorAll('span, div')).find(function(el){return normStr(el.textContent)==='enviar'&&el.offsetWidth>0;})?.closest('.item.forward');
    fw?.click();
    var step=0,
        tFind=(item&&item.etiqueta_externo)?item.etiqueta_externo:(item.etiqueta||item.titulo),
        sFind=(item&&item.servico)?item.servico:'Reparo Físico';
    var steps=[
        function(n){selOpt(0,'suporte externo',false,n);},
        function(n){clickBtnByText('encaminhar');setTimeout(n,1500);},
        function(n){
            if(isAgd){
                var sw=d.querySelector('button.ant-switch, nz-switch button');
                if(sw&&!sw.classList.contains('ant-switch-checked'))sw.click();
            }
            n();
        },
        function(n){
            (async function(){
                var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms);});};
                var isV=function(el){return el&&window.getComputedStyle(el).display!=='none'&&window.getComputedStyle(el).visibility!=='hidden'&&el.offsetWidth>0;};
                var clk=function(el){
                    if(!el)return;
                    try{el.scrollIntoView({behavior:'instant',block:'center'});}catch(e){}
                    var o={bubbles:true,cancelable:true,view:window};
                    el.dispatchEvent(new MouseEvent('mousedown',o));
                    el.dispatchEvent(new MouseEvent('mouseup',o));
                    el.click();
                };
                var setInp=function(el,val){
                    if(!el)return;
                    try{el.focus();}catch(e){}
                    var s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value')?.set;
                    if(s)s.call(el,val);
                    else el.value=val;
                    el.dispatchEvent(new Event('input',{bubbles:true}));
                };
                var wait=async function(fn,to=6000){
                    var s=Date.now();
                    while(Date.now()-s<to){
                        try{var el=fn();if(el&&isV(el))return el;}catch(e){}
                        await sleep(150);
                    }
                    return null;
                };
                var findOpt=function(txt,st=false){
                    var ols=Array.from(d.querySelectorAll('.cdk-overlay-pane, .cdk-overlay-container')).filter(isV),
                        cnt=ols[ols.length-1]||d,
                        its=Array.from(cnt.querySelectorAll('li.ant-select-dropdown-menu-item, li, nz-option-item, [role="option"]')).filter(isV),
                        al=txt.trim().toLowerCase();
                    return its.find(function(el){return(el.innerText||el.textContent||'').trim().toLowerCase()===al;})||
                           (!st&&(its.find(function(el){return(el.innerText||el.textContent||'').trim().toLowerCase().startsWith(al);})||
                                  its.find(function(el){return(el.innerText||el.textContent||'').trim().toLowerCase().indexOf(al)!==-1;})))||null;
                };
                try{
                    var sProb=d.querySelector("nz-select#problem");
                    if(!sProb||!(sProb.innerText||'').toLowerCase().includes(tFind.toLowerCase())){
                        var trP=await wait(function(){return d.querySelector("nz-select#problem .ant-select-selection");});
                        if(trP){
                            clk(trP);
                            await sleep(600);
                            var inP=d.querySelector("nz-select#problem input.ant-select-search__field, .cdk-overlay-container input.ant-select-search__field, nz-select#problem input");
                            if(inP){setInp(inP,tFind);await sleep(600);}
                            var oP=await wait(function(){return findOpt(tFind+" ("+sFind.toLowerCase()+")",true)||findOpt(tFind);});
                            if(oP)clk(oP);
                            await sleep(500);
                            clk(d.querySelector('.cdk-overlay-backdrop-showing, .cdk-overlay-transparent-backdrop')||d.querySelector('.ant-modal-title, app-new-schedule h1'));
                            await sleep(400);
                        }
                    }
                    var sSrv=d.querySelector("nz-select#service");
                    if(!sSrv||!(sSrv.innerText||'').toLowerCase().includes(sFind.toLowerCase())){
                        var trS=await wait(function(){return d.querySelector("nz-select#service .ant-select-selection");});
                        if(trS){
                            clk(trS);
                            await sleep(600);
                            var inS=d.querySelector("nz-select#service input.ant-select-search__field, .cdk-overlay-container input.ant-select-search__field, nz-select#service input");
                            if(inS){setInp(inS,sFind);await sleep(600);}
                            var oS=await wait(function(){return findOpt(sFind,true)||findOpt(sFind,false);});
                            if(oS)clk(oS);
                            await sleep(600);
                        }
                    }
                    var btnCont=await wait(function(){
                        return Array.from(d.querySelectorAll("app-schedule-footer button, nz-modal button, ion-button button, button")).find(function(b){
                            return(b.innerText||b.textContent||"").toLowerCase().indexOf("continuar")!==-1&&!b.disabled&&isV(b);
                        });
                    });
                    if(btnCont){clk(btnCont);if(btnCont.closest('ion-button'))clk(btnCont.closest('ion-button'));}
                    await sleep(1500);
                    var btnAg=await wait(function(){
                        return Array.from(d.querySelectorAll("app-ray-calendar button, td button, app-ray-data-cell button")).find(function(b){
                            return(b.innerText||b.textContent||"").toLowerCase().indexOf("agendar")!==-1&&isV(b);
                        });
                    });
                    if(btnAg)clk(btnAg);
                    await sleep(600);
                    var chip=await wait(function(){
                        return Array.from(d.querySelectorAll("ion-chip, [class*='chip'], button, .chip")).find(function(el){
                            return(el.innerText||el.textContent||"").indexOf("06:00")!==-1&&isV(el);
                        });
                    });
                    if(chip)clk(chip);
                }catch(e){}
                n();
            })();
        },
        function(n){n();}
    ];
    function next(){if(step<steps.length)steps[step++](next);}
    setTimeout(next,1000);
}

function toggleAguardar(w){
