JavaScript:(function(){
    'use strict';
    var d = document;
    if (d.getElementById('m-ui')) {
        var p = d.getElementById('m-ui');
        p.style.display = p.style.display === 'none' ? 'block' : 'none';
        return;
    }

    var savedThm = localStorage.getItem('y_hud_theme') || 'black_red';
    var savedIcn = localStorage.getItem('y_hud_icon') || 'clover';
    var savedFnt = localStorage.getItem('y_hud_font') || 'cyber';
    var savedBg = localStorage.getItem('y_hud_c_bg') || '#08060f';
    var savedBdr = localStorage.getItem('y_hud_c_bdr') || '#dc2626';

    var fontLinks = {
        cyber: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap',
        old: 'https://fonts.googleapis.com/css2?family=VT323&display=swap',
        common: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
        signature: 'https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap',
        cloister: 'https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap'
    };
    var fontFamilies = {
        cyber: "'Orbitron', monospace",
        old: "'VT323', monospace",
        common: "'Inter', sans-serif",
        signature: "'Caveat', cursive",
        cloister: "'UnifrakturMaguntia', cursive"
    };
    var fontSizes = { cyber: '10.5px', old: '15px', common: '12px', signature: '16px', cloister: '14px' };
    
    var fL = d.createElement('link');
    fL.id = 'm-custom-font';
    fL.rel = 'stylesheet';
    fL.href = fontLinks[savedFnt] || fontLinks.cyber;
    d.head.appendChild(fL);

    // BASE DE MOTIVOS (COM AS SUAS CORREÇÕES)
    var raw = [
        ["Desconexão Chat", "Inatividade Chat", false, "Reparo Físico", "fez contato e durante o atendimento ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.", "Desconexão Chat"],
        ["Rota Inoperante", "Rota Inoperante - FTTH", false, "Reparo Físico", "Fez contato para relatar a ausência de acesso. Foi explicado a ele que, naquele momento, a falta de acesso se deve a um rompimento de cabo de fibra que impactou toda a sua rota. Foi fornecido o prazo estimado pela URA para a regularização da situação. O cliente foi informado e está ciente dos detalhes.", "Rota Inoperante - FTTH"],
        ["Suspeita de LOS", "Suspeita de LOS", true, "Reparo Físico", "Relatou a falta de acesso e a presença de um LED vermelho piscando. Ao questionar a possibilidade de incidentes ou remoção de equipamentos, o cliente negou qualquer ocorrência. Após constatar a normalidade da rota, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "los"],
        ["Transferência", "Solicitação de dados", false, "Reparo Físico", "entrou em contato buscando informações ou um serviço que não se enquadrava na competência deste setor. Não houve necessidade de sondagem. Em vista disso, o cliente foi encaminhado ao setor competente para atender à sua demanda.", "Solicitação de dados"],
        ["Desconexão Chat - Internet", "Desconexão Chat", false, "Reparo Físico", "cliente fez contato para relatar problema em sua conexão a internet. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.", "Desconexão Chat"],
        ["Lentidão - Resolvida", "Lentidão - FTTH", false, "Reparo Rápido", "fez contato para relatar lentidão em sua conexão. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que o acesso foi normalizado.", "Lentidão"],
        ["Lentidão - Externo", "Lentidão - FTTH", true, "Reparo Rápido", "fez contato para relatar lentidão em sua conexão recorrentemente. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que a princípio o acesso foi normalizado, mas irá continuar realizando testes ao longo do restante do dia e, caso a instabilidade persista, ele irá entrar em contato conosco para que possamos verificar ou providenciar o envio de uma equipe ao local, se necessário.", "Lentidão"],
        ["Lentidão - Ficou testando", "Lentidão - FTTH", false, "Reparo Rápido", "Cliente relatou lentidão na conexão. Foram realizados procedimentos de otimização da rede, incluindo reinicialização remota dos equipamentos e verificação do sinal. O cliente permaneceu em teste para avaliar a melhoria no acesso. Caso persista a instabilidade, orientamos entrar em contato novamente para novas verificações.", "Lentidão"],
        ["Lentidão - Inativo", "Lentidão - FTTH", false, "Reparo Físico", "cliente, entrou em contato informando estar com problemas de lentidão na sua conexão, verificado que o sinal da fibra está normal, perguntei se o problema ocorria em todos os aparelhos, mesmo quando o cliente acessa a rede próximo do roteador, o cliente informou que sim, então foi alterado o canal, ativado roteador e reiniciado manualmente os equipamentos, cliente ficou inativo chamado será encerrado.", "Lentidão"],
        ["Lentidão - Recorrente", "Lentidão - FTTH", true, "Reparo Rápido", "informa estar enfrentando lentidão. Após verificação, observa-se que o problema afeta todos os dispositivos e se restringe à rede sem fio. Eu menciono a intenção de atualizar a rede, no entanto, o cliente destaca que essa questão é recorrente e deseja que uma equipe externa conduza uma análise, uma vez que já havia contatado previamente sem sucesso. Diante da insatisfação do cliente e da constatação de que se trata de uma situação frequente ainda não atendida localmente, uma Ordem de Serviço (O.S.) vai ser aberta para resolver o problema e garantir a retenção do cliente. Agendado de acordo com a disponibilidade do cliente.", "Lentidão"],
        ["Rede sumiu", "Instabilidade TP-LINK", false, "Reparo Rápido", "relatou que estava sem conexão com a internet e que o nome da rede Wi-Fi não estava aparecendo. Após realizar algumas alterações na configuração da rede, a conexão foi restabelecida com o nome e senha originais. O usuário confirmou que a internet voltou a funcionar corretamente.", "Instabilidade TP-LINK"],
        ["Sem gerencia - Resolvido", "Sem acesso TP-LINK", false, "Reparo Rápido", "fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Com base na realização desses passos, foi possível restabelecer o acesso.", "Sem acesso TP-LINK"],
        ["Sem gerencia - Externo", "Sem acesso TP-LINK", true, "Reparo Rápido", "fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Mesmo após a realização desses passos, não foi possível restabelecer o acesso, dessa forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "Sem acesso TP-LINK"],
        ["PON Piscando - Resolvido", "PON piscando - FTTH", false, "Reparo Físico", "Relata que está enfrentando uma interrupção na sua conexão com a internet. Após indagar sobre a situação do LED PON, o cliente confirma que ele está piscando. Ao constatar que a rota está operante, foram executados os procedimentos padrões conforme documentados nos registros de eventos. Após a execução dessas ações, a conectividade foi restabelecida com êxito.", "PON Piscando"],
        ["PON Piscando - Externo", "PON piscando - FTTH", true, "Reparo Físico", "Relata que está enfrentando uma interrupção na sua conexão com a internet. Após questionar sobre a situação do LED PON, o cliente confirma que ele está piscando. Ao constatar que a rota está operante, foram executados os procedimentos padrões conforme documentados nos registros de eventos. O cliente informou que o acesso continua interrompido, desta forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "PON Piscando"],
        ["PON Apagada - Resolvido", "PON Apagada", false, "Reparo Rápido", "Entrou em contato informando que os serviços da Brisanet estão sem sinal. Ao ser questionado sobre a ativação da LED PON e a ocorrência de acidentes ou remoção de equipamento, o cliente negou qualquer incidente. Após verificar que a rota está normal, procedeu-se à reconfiguração e reinicialização do modem ONU, além de conectá-lo em outra tomada de energia. O cliente reportou que o acesso foi normalizado.", "PON apagada - FTTH"],
        ["PON Apagada - Externo", "PON apagada - FTTH", true, "Reparo Rápido", "Entrou em contato relatando uma interrupção em sua conexão com a internet. Após questionar sobre a situação do LED PON, o cliente confirmou que ele está apagado. Ao constatar que a rota está operante, seguimos os procedimentos padrões conforme documentados nos registros de eventos. Adicionalmente, conectamos o equipamento em outra tomada de energia e verificamos o botão 'ON/OFF'. No entanto, o cliente informou que o acesso continua interrompido. Diante dessa situação, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local e resolver o problema. Agendado de acordo com a disponibilidade do cliente.", "PON Apagada"],
        ["Fibra Rompida", "Cabo da fibra rompido", true, "Reparo Físico", "Relata que algo rompeu o cabo de fibra fora de sua residência. Não foi necessário realizar alguma sondagem. Foi aberta uma ordem de serviço para resolução do problema e a visita técnica agendada para de acordo com a disponibilidade do cliente.", "Cabo da fibra rompido"],
        ["Fibra Baixa", "Cabo de fibra baixo/remanejamento - FTTH", true, "Serviço Adicional", "Relata sobre um cabo de fibra solto fora de sua residência, foi aberta uma Ordem de Serviço (OS) para verificação. Agendado de acordo com a disponibilidade do cliente.", "Cabo de fibra baixo/remanejamento"],
        ["Fibra Ressecada", "Troca de cabo fibra - FTTH", true, "Reparo Físico", "Relata que o cabo de fibra está ressecado em sua residência, onde ninguém mexeu. O cabo corre o risco de ser roto. Foi aberta uma ordem de serviço para verificar o problema. Agendado de acordo com a disponibilidade do cliente.", "Cabo da fibra rompido"],
        ["Remanejamento de Fibra", "Cabo de fibra baixo/remanejamento - FTTH", true, "Serviço Adicional", "Relata sobre a necessidade do remanejamento do cabo de fibra, pois, está passando sobre propriedades alheias. Agendado de acordo com a disponibilidade do cliente.", "Cabo de fibra baixo/remanejamento"],
        ["Quedas na conexão - Resolvido", "Quedas na conexão - FTTH", false, "Reparo Rápido", "fez contato para relatar quedas de acesso em sua conexão. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que o acesso foi normalizado.", "Instabilidade na rede WI-FI"],
        ["Quedas na conexão - Externo", "Quedas na conexão - FTTH", true, "Reparo Rápido", "fez contato para relatar quedas de acesso em sua conexão recorrentemente. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que a princípio o acesso foi normalizado, mas irá continuar realizando testes ao longo do restante do dia e, caso a instabilidade persista, ele irá entrar em contato conosco para que possamos verificar ou providenciar o envio de uma equipe ao local, se necessário.", "Instabilidade TP-LINK"],
        ["Quedas de conexão - Ficou testando", "Quedas na conexão - FTTH", false, "Reparo Rápido", "fez contato para relatar quedas de acesso em sua conexão. Após verificar as informações junto ao cliente, constatou-se que o problema ocorria tanto nas proximidades quanto em locais mais distantes do roteador/modem, contudo limitava-se à rede Wi-Fi. Foram executados os procedimentos padrões conforme documentados nos registros de eventos, e solicitados alguns procedimentos manuais usuais. O cliente informou que o acesso continua instável, desta forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "Quedas de conexão - FTTH"],
        ["Sem acesso com sinal - Resolvido", "sem Acesso", false, "Reparo Rápido", "fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Com base na realização desses passos, foi possível restabelecer o acesso.", "sem Acesso"],
        ["Sem acesso com sinal - Externo", "sem Acesso", true, "Reparo Rápido", "fez contato para comunicar a ausência de acesso. Foi verificado que a ONU apresentava sinal e o roteador não estava gerenciando a conexão. Após verificar a conexão do cabo, orientou-se o cliente a reiniciar o roteador TP-link. Paralelamente, foi efetuada uma reconfiguração remota. Mesmo após a realização desses passos, não foi possível restabelecer o acesso, dessa forma foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "sem Acesso"],
        ["Sinal irregular - externo", "Sinal da fibra do cliente irregular - FTTH", true, "Reparo Físico", "relata sobre falta de acesso à internet, foi constatada irregularidade no sinal da PON. A rota foi verificada e estava dentro dos padrões. Questionado sobre possíveis incidentes ou remoção de equipamentos, o cliente negou qualquer ocorrência. Diante disso, foi gerada uma Ordem de Serviço (OS) para inspeção presencial no local, a ser agendada conforme disponibilidade do cliente.", "Sinal irregular Fibra"],
        ["Senha da rede wi-fi incorreta", "Alterações nas configurações do Wi-Fi - FTTH", false, "Reparo Físico", "relata que está sem acesso à internet. Verificamos que a rede Wi-Fi do cliente não conecta, com a mensagem de erro de autenticação. A falha na autenticação pode ter sido causada por uma senha incorreta ou por um problema no roteador. Geramos uma nova senha para o cliente e o acesso foi normalizado.", "Alterações nas configurações do Wi-Fi - FTTH"],
        ["Alteração de senha - Resolvido", "Alterações nas configurações do Wi-Fi - FTTH", false, "Reparo Físico", "solicitou a alteração da senha da rede Wi-Fi. Foi explicado que a senha é gerada aleatoriamente e composta por caracteres minúsculos. Senha gerada e cliente com acesso", "Alterações nas configurações do Wi-Fi - FTTH"],
        ["Alteração de senha - Inativo", "Alterações nas configurações do Wi-Fi - FTTH", false, "Reparo Físico", "solicitou a alteração da senha da rede Wi-Fi. Foi explicado que a senha é gerada aleatoriamente e composta por caracteres minúsculos. Senha gerada, porém, o cliente ficou sem interagir até o encerramento do atendimento.", "Alterações nas configurações do Wi-Fi - FTTH"],
        ["Plano no cabo - Resolvido", "Plano não chega o contratado - FTTH", false, "Reparo Rápido", "informou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico na sua PON está dentro dos padrões. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, verificamos a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Após essas verificações, realizamos um teste adicional no velocímetro, e agora a velocidade atingiu o contratado.", "Plano não chega o contratado - FTTH"],
        ["Plano no cabo - Externo", "Plano não chega o contratado - FTTH", true, "Reparo Rápido", "informou estar enfrentando problemas de instabilidade, já que a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico de sua PON está dentro dos padrões. Executamos os procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, constatamos que a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Apesar dessas verificações, o teste adicional no velocímetro ainda indicou uma velocidade inferior à garantida. Diante disso, foi gerada uma Ordem de Serviço (O.S.) para efetuar uma inspeção direta no local. Agendado de acordo com a disponibilidade do cliente.", "Plano não chega o contratado"],
        ["Plano no cabo - Ficou testando", "Plano não chega o contratado - FTTH", false, "Reparo Rápido", "informou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Verificado o sinal óptico na sua PON está dentro dos padrões. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Além disso, verificamos a placa de rede é Gigabyte e o cabo de rede é CAT. 5E. Após essas verificações, realizamos um teste adicional no velocímetro, e agora a velocidade atingiu o contratado, porém, voltou a abaixar. Devido isso, o cliente ficou de continuar testando durante o restante do dia e caso continue persistido, irá entrar em contato para enviarmos uma equipe para analisar.", "Plano não chega o contratado - FTTH"],
        ["Plano no wi-fi - Ficou testando", "Plano não chega o contratado - FTTH", false, "Reparo Rápido", "relatou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede sem fio. Verificamos que o sinal óptico de sua PON estava dentro dos padrões. Nesse contexto, explicamos sobre a garantia de entrega de velocidade apenas na rede cabeada e oferecemos um procedimento remoto para tentar melhorar, embora não pudéssemos garantir o mesmo desempenho na rede sem fio. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do aparelho usado para testar. Apesar dessas verificações, o teste no velocímetro ainda indicou uma velocidade inferior à garantida. Diante dessa situação, o cliente ficou de realizar o teste no cabo quando puder.", "Plano não chega o contratado - FTTH"],
        ["Plano no wi-fi - externo", "Plano não chega o contratado - FTTH", true, "Reparo Rápido", "relatou enfrentar problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede sem fio. Verificado o sinal óptico de sua PON estava dentro dos padrões. Nesse contexto, explicamos sobre a garantia de entrega de velocidade apenas na rede cabeada e oferecemos um procedimento remoto para tentar melhorar, embora não pudéssemos garantir o mesmo desempenho na rede sem fio. Procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do aparelho usado para testar. Apesar dessas verificações, o teste no velocímetro ainda indicou uma velocidade inferior à garantida. Diante dessa situação, o cliente solicitou a presença de uma equipe no local, com um notebook e cabo de rede da Brisanet para uma inspeção direta e comprovação da entrega do plano. Foi gerada uma Ordem de Serviço (O.S.) para efetuar essa inspeção. Agendado de acordo com a disponibilidade do cliente.", "Plano não chega o contratado"],
        ["Placa de rede FE", "Plano não chega o contratado - FTTH", false, "Reparo Rápido", "relatou estar enfrentando problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Após verificar que o sinal óptico na sua PON está dentro dos padrões, procedemos à execução dos procedimentos padrões, conforme documentados nos registros de eventos, e solicitamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Após essas verificações, realizamos um teste adicional no velocímetro; no entanto, a velocidade continuou na mesma média de 90 Mbps. Verificamos que o cabo de rede é CAT. 5E e, ao examinar a placa de rede, identificamos que o problema está sendo ocasionado pela placa de rede FE (/100). O cliente está ciente dessa situação.", "Plano não chega o contratado - FTTH"],
        ["Placa de rede FE - externo", "Plano não chega o contratado - FTTH", true, "Reparo Rápido", "relatou enfrentar problemas de instabilidade, pois a velocidade do plano contratado não está sendo alcançada na rede cabeada. Após verificar que o sinal óptico na sua PON está dentro dos padrões, realizamos os procedimentos padrão, conforme documentados nos registros de eventos, e recomendamos alguns procedimentos manuais usuais, incluindo o reinício do computador. Após essas verificações, realizamos um teste adicional no velocímetro; no entanto, a velocidade continuou na mesma média de 90 Mbps. Verificamos que o cabo de rede é CAT. 5E e, ao examinar a placa de rede, identificamos que o problema está sendo ocasionado pela placa de rede FE (/100). O cliente está ciente dessa situação, mas deseja a visita de uma equipe para confirmar que está recebendo o serviço contratado. Diante disso, geramos uma Ordem de Serviço (O.S.) para realizar uma inspeção presencial no local. Agendado de acordo com a disponibilidade do cliente.", "Plano não chega o contratado"],
        ["Rota com sinal irregular", "Rota com sinal irregular - FTTH", false, "Reparo Físico", "relata interrupção do serviço de acesso à internet. Após análise, constatou-se anomalia no sinal da PON. A rota foi verificada e apresenta falhas. O cliente foi informado sobre o prazo de 24 horas para a resolução do problema, que está relacionado à rota.", "Rota com sinal irregular - FTTH"],
        ["Transfêrencia para o setor cancelamento", "Informação cancelamento", false, "Reparo Físico", "transferido para o setor de cancelamento. O cliente solicitou o cancelamento do serviço da brisanet e recusou qualquer tipo de tratativa.", "Informação cancelamento"],
        ["Instalação Mal Sucedida", "Instalação mal sucedida (sem acesso) - 7d", true, "Reclamação de instalação de serviço", "Instalação recente com pendência de sinal/alinhamento. Aberta prioridade para retorno técnico.", "Instalação mal sucedida (sem acesso) - 7d"],
        ["Desconexão Chat - Telefone fixo", "Desconexão Chat", false, "Reparo Físico", "fez contato para relatar problema em seu telefone fixo. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.", "Desconexão Chat"],
        ["Desconexão Chat - BrisaTV", "Desconexão Chat", false, "Reparo Físico", "fez contato para relatar problema em seu serviço de TV. Durante o atendimento, ele ficou inativo durante todo o atendimento, resultando no encerramento automático devido à falta de atividade.", "Desconexão Chat"],
        ["Não está no local", "Instabilidade na entrega do serviço", false, "Reparo Físico", "entra em contato informando problema nos serviços da Brisanet, porém, durante a sondagem foi verificado que o mesmo não está na residência para verificar ou testar o serviço. O mesmo ficou de entrar em contato quando estiver no local.", "Instabilidade na entrega do serviço"],
        ["Já solucionado", "Informações do serviço", false, "Reparo Físico", "comunica que no início do atendimento a questão já foi solucionada, tornando desnecessária a continuação do suporte.", "Informações do serviço"],
        ["Falta de cordialidade", "Instabilidade na entrega do serviço", false, "Reparo Físico", "reporta um problema nos serviços da brisanet. Entretanto, durante o atendimento, houve o uso de linguagem inadequada, o que me levou a encerrar a conversa.", "Instabilidade na entrega do serviço"],
        ["Em horário de expediente", "Instabilidade na entrega do serviço", false, "Reparo Físico", "entra em contato informando problema nos serviços da Brisanet, porém, durante a sondagem foi verificado que o mesmo está em horário de expediente, e por isso não podemos realizar a tratativa do problema. O mesmo ficou de entrar em contato quando estiver disponível.", "Instabilidade na entrega do serviço"],
        ["Urgência de última hora", "Instabilidade na entrega do serviço", false, "Reparo Físico", "comunica dificuldades com o serviço da brisanet. Durante a verificação, constatou-se que o cliente não estava em disponível para dar continuidade ao processo. Ele entrará em contato quando estiver disponível.", "Cabo da fibra rompido"],
        ["Solicitação de cancelamento", "Solicitação de cancelamento", false, "Reparo Físico", "entrou em contato solicitando o cancelamento dos serviços Brisanet. Cliente ciente que o nosso setor de retenção entrará em contato com a mesma.", "Solicitação de cancelamento"],
        ["Procedimento somente com o titular", "Atendimento encerrado - Não é o titular", false, "Reparo Físico", "solicita atendimento que envolve negociação/alteração de dados do cadastro, Por questões de segurança dos dados pessoais do titular, informamos que só podemos proceder após conversar diretamente com o titular do contrato.", "Atendimento encerrado - Não é o titular"],
        ["Comando CRM", "Sem acesso", false, "Reparo Rápido", "Relata que está sem acesso à internet. Verificamos o comando CRM no sistema e reforçamos o prazo de 24 horas para a resolução do problema. Ressaltamos que se trata do comando de ativação do serviço.", "Sem acesso"],
        ["Ping na rede cabeada - Resolvido", "Ping alto", false, "Reparo Físico", "relatou problemas com alta latência (ping) ao jogar, mesmo utilizando uma conexão cabeada. Após confirmar as informações do titular, foi feita uma reconfiguração da rede e o cliente foi orientado a reiniciar o roteador. A latência foi reduzida para 60 ms, ficando dentro da garantia da brisanet.", "Cabo da fibra rompido"],
        ["Ping na rede cabeada - Ficou testando", "Ping alto", false, "Reparo Rápido", "relatou problemas com alta latência (ping) ao jogar, mesmo utilizando uma conexão cabeada. Após confirmar as informações do titular, foi feita uma reconfiguração da rede e o cliente foi orientado a reiniciar o roteador. A latência foi reduzida para 60 ms, ficando dentro da garantia da brisanet. O cliente foi instruído a monitorar o desempenho ao longo do dia e a entrar em contato novamente se o problema persistir, para que uma equipe técnica especializada possa ser enviada.", "Ping alto"],
        ["Ausência de confirmação da ID positiva", "Ausência de confirmação de dados", false, "Reparo Físico", "não procedeu com a confirmação dos dados correspondentes ao titular durante o decorrer do atendimento. Em razão da segurança do titular, o atendimento foi encerrado. Foi feita a requisição dos dados em três ocasiões.", "Ausência de confirmação de dados"],
        ["Cobrança de cancelamento", "Informação cancelamento", false, "Reparo Físico", "entrou em contato para cobrar um retorno em relação à sua solicitação de cancelamento. Ele forneceu o número de contato, e o prazo para o retorno foi devidamente comunicado. Ainda, foi esclarecido que ele pode encurtar o processo ao se dirigir diretamente ao setor competente por meio do número 0800 281 3017.", "Informação cancelamento"],
        ["Valores do cancelamento", "Informação cancelamento", false, "Reparo Físico", "busca informações sobre os valores do contrato de fidelização em caso de cancelamento. Identificamos um erro no sistema que impede a obtenção dessas informações. Encaminhamos o contato para o setor de retenção, capacitado para fornecer as informações desejadas.", "Informação cancelamento"],
        ["Manutenção no Revan", "Sistema interno indisponível", false, "Reparo Físico", "fez contato, porém, foi explicado a ele que, naquele momento, o nosso sistema interno estava em manutenção e devido a isso, não tínhamos como fazer nenhum procedimento remoto, sendo necessário aguardar. Foi fornecido o prazo estimado pela URA para a regularização da situação. O cliente foi informado e está ciente dos detalhes.", "Sistema interno indisponível"],
        ["Desconto por Rota Inoperante", "Desconto de rota inoperante", false, "Reparo Físico", "Entra em contato para solicitar desconto referente ao tempo que ficou sem acesso. Foi repassado que o desconto é fornecido somente pelo nosso setor financeiro, que pode ser contactado por ligação no número 0800 281 3017.", "Informações do serviço"],
        ["Instabilidade geral em TP-links", "Instabilidade TP-Link", false, "Reparo Rápido", "entra em contato informando instabilidade em seu roteador da TP-link. Verificado um problema geral onde não é possivel realizar nenhuma tratatativa em roteadores da marca TP-link. Repassado prazo conforme a URA.", "Instabilidade TP-Link"],
        ["Problema geral na cidade", "Instabilidade na entrega do serviço", false, "Reparo Físico", "relata instabilidade nos serviços da brisanet, devido a um problema geral na cidade do cliente, não foi possível realizar uma verificação completa no momento. Cliente foi orientado a entrar em contato novamente quando o acesso estiver normalizado. Cliente ciente e de acordo.", "Instabilidade na entrega do serviço"],
        ["OLT em Manutenção", "Problema na OLT", false, "Reparo Físico", "Entrou em contato relatando falta de internet. Foi informado que há uma manutenção em andamento na OLT que afeta o sinal do cliente e de vários outros clientes. Foi repassado o prazo máximo de normalização conforme a URA, porém o serviço pode voltar a qualquer momento. Cliente foi orientado a entrar em contato com o setor financeiro para solicitar desconto referente ao tempo sem acesso após a normalização. Cliente ciente e de acordo.", "Informações do serviço"],
        ["Problema em roteador particular - Técnico particular", "Suporte a equipamento particular", false, "Serviço Adicional", "relatou problemas com seu roteador particular, que estava sem acesso à internet. Após a verificação, foi constatado que o roteador da Brisanet estava funcionando normalmente, mas o roteador específico continuava sem conexão. Foi recomendado que o cliente reinicie o roteador particular, logo após ser reconfigurado os equipamentos da brisanet. Como o acesso não retornou, foi recomendado que verifique as configurações, conexões de cabos e possíveis interferências. Caso o problema persista, foi sugerido entrar em contato com o suporte técnico do roteador para assistência personalizada.", "Suporte a equipamento particular"],
        ["BrisaCliente - Primeiro acesso", "BrisaCliente", false, "Reparo Rápido", "está buscando assistência para acessar o aplicativo BrisaCliente. Foi fornecido um guia com todos os passos", "BrisaCliente"],
        ["BrisaCliente - Primeiro acesso escritorio", "BrisaCliente", false, "Reparo Rápido", "entrou em contato relatando que não estava recebendo o SMS de confirmação para realizar o primeiro acesso ao aplicativo BrisaCliente. Foi solicitado um número que pudesse receber SMS, mas o problema persistiu. Diante da falta de outro número disponível com o mesmo DDD, foi informado que seria necessário visitar uma loja ou escritório da empresa para que a configuração fosse realizada.", "BrisaCliente"],
        ["BrisaCliente - Recuperar a senha", "BrisaCliente", false, "Reparo Rápido", "pediu ajuda para recuperar a senha do aplicativo BrisaCliente. Enviamos um passo a passo para guiá-lo durante o processo de recuperação.", "BrisaCliente"],
        ["Globoplay - Primeiro acesso", "Globoplay", false, "Reparo Rápido", "está buscando assistência para acessar o aplicativo Globoplay. Foi fornecido um guia com todos os passos", "Globoplay"],
        ["Globoplay - Suporte do serviço", "Globoplay", false, "Reparo Rápido", "entrou em contato relatando um problema com o aplicativo GloboPlay na TV, mencionando que uma série que estava assistindo não carregava há duas semanas. Após realizar uma reconfiguração da rede e confirmar que a conexão estava funcionando corretamente, foi identificado que o problema estava no próprio aplicativo da GloboPlay. O cliente foi orientado a entrar em contato com o suporte da GloboPlay através dos números 0800 881 8000 ou 4003 8000 para resolver o problema.", "Globoplay"],
        ["Netflix - Primeiro acesso", "Netflix", false, "Reparo Rápido", "está buscando assistência para acessar o aplicativo Netflix. Foi fornecido um guia com todos os passos", "Netflix"],
        ["PON Piscando - GPON", "PON piscando - FTTH", false, "Reparo Físico", "Entra em contato informando que está sem acesso, verificado que o LED PON está piscando, dessa forma foi reconfigurado a ONU e o problema persistiu. Foi tentado mais uma vez e o problema ainda persiste. O problema foi repassado pela liderança para o GPON verificar. Prazo de 24 horas. Cliente ciente do retorno.", "PON Piscando"],
        ["Alteração de cômodo", "Alteração de cômodo", true, "Serviço Adicional", "fica ciente do prazo, há questões de valores: R$ 30,00 pela alteração; no caso de utilização de novo cabo FTTH/RJ45, são mais R$1,30 por metro utilizado. Confirmado CPF e endereço. PS: levar termo de compromisso para ser assinado pelo cliente ou responsável. E anexar imagem ao chamado, também como do lugar onde ficou o equipamento.", "Alteração de cômodo"],
        ["Revisão de equipamento", "Revisão de Equipamento", true, "Reparo Rápido", "entrou em contato via Whatsapp informando estar com instabilidade e problemas de conexão. Informado ao cliente sobre as instabilidades da rede WI-FI, sobre o alcance da rede WI-FI e testes via WI-FI. Canais foram alterados, sinal e IP normal, ONU Ativada/reconfigurada. O Cliente informa que a sua conexão não melhorou, por gentileza, passar, verificar se existe algum problema lógico na ONU do cliente, caso seja constatado, por gentileza, entrar em contato com o suporte regional e realizar a troca da ONU, se autorizado, por outra de mesmo modelo a fim de verificar melhorias na conexão e reforçar também as informações supracitadas. PS. Caso alguma informação sobre serviço adicional (troca de ONU, cabo de rede, alteração de parede ou cômodo) for informada ao cliente, por gentileza, registrar no chamado.", "Revisão de Equipamento"],
        ["Configuração Estruturada de Rede Interna", "Configuração Estruturada de Rede Interna", true, "Serviço Adicional", "Entrou em contato solicitando a visita de um técnico para configurar e instalar um aparelho particular na sua residência, dessa forma foi aberto uma O.S. Por gentileza, passar no local realizar a configuração da sua rede interna, o cliente está ciente que o tal procedimento é gerado uma taxa de R$ 90,00 reais, podendo ser dividido em até 3X. onde o cliente tem direito a 20 metros de cabo de rede, caso seja utilizado metragem de cabos superior a 20 metros será cobrado mais R$ 1,30 por metro. CPF confirmado. Cliente ciente do prazo e no aguardo.", "Configuração Estruturada de Rede Interna"],
        ["Hibernação chat", "Hibernação chat", false, "Reparo Físico", "O cliente permaneceu inativo por 10 minutos, mesmo após o envio de alertas de hibernação. Diante da continuidade da inatividade, o mesmo foi realocado para a fila de hibernação.", "Serviço Adicional"],
        ["Area interditada sem retorno", "Rota Inoperante", false, "Reparo Físico", "O cliente relatou indisponibilidade do serviço de internet há quatro dias. Foi verificado em sistema que a região do cliente está classificada como área de risco, o que impede a realização de manutenções pela operadora no momento. O atendimento foi finalizado após o esclarecimento sobre as restrições operacionais na área.", "Serviço Adicional"],
        ["Função - WPS", "Informação Técnica", false, "Reparo Físico", "entrou em contato solicitando conexão via WPS em sua impressora, foi informado que a função é bloqueada de fábrica nos equipamentos da brisanet, o cliente ficou ciente de que só é possível utilizar essa função em um roteador particular.", "Informação Técnica"],
        ["Torre inoperante - FWA", "Torre inoperante - FWA", false, "Reparo Físico", "Cliente entrou em contato informando falta de acesso à internet. Verificado em sistema e constatado que a torre está fora do ar. Foi informado ao cliente o prazo de 12 horas para normalização. Cliente ciente e aguarda retorno.", "Serviço Adicional"],
        ["LENTIDÃO - Resolvido FWA", "Lentidão - FWA", false, "Reparo Físico", "Cliente relatou lentidão no FWA durante o uso. Após a verificação inicial, foram realizados os procedimentos informados no treinamento, incluindo ajustes no equipamento e testes de conectividade. Com isso, foi possível restabelecer o acesso, e a lentidão foi resolvida. O cliente confirmou que o serviço voltou a operar normalmente, sem mais sinais de instabilidade.", "Serviço Adicional"],
        ["CPE sem sinal - FWA", "CPE sem sinal - FWA", true, "Reparo Físico", "Informou estar sem acesso. Verificado equipamento(s) ligado(s) e led vermelho piscando; cliente informou que ninguém mexeu no(s) equipamento(s). Verificado na planilha de acompanhamento 5G. Aberto O.S para verificação no local.", "CPE sem sinal - FWA"],
        ["LED 5G - APAGADO - Resolvido (FWA)", "CPE sem sinal - FWA", false, "Reparo Físico", "entrou em contato informando que o LED 5G estava apagado. Foi verificado que o problema estava relacionado ao cartão SIM não conectado. O cliente foi orientado a verificar se o chip estava corretamente inserido e reiniciar o aparelho. Após seguir as instruções, o acesso foi normalizado e o LED 5G acendeu.", "CPE sem sinal - FWA"],
        ["LED 5G - APAGADO - Aguarda o prazo (FWA)", "CPE sem sinal - FWA", false, "Reparo Físico", "relatou que o LED 5G estava apagado. Ao verificar a conexão do cartão SIM e reiniciar o aparelho, o problema persistiu. Foi consultada a liderança e identificado que o problema está relacionado ao rádio. Foi repassado o prazo para normalização do serviço e o cliente foi informado sobre a previsão de resolução.", "CPE sem sinal - FWA"],
        ["LED 5G - APAGADO - Externo (FWA)", "CPE sem sinal - FWA", true, "Reparo Físico", "informou que o LED 5G estava apagado. Verificado que o cartão SIM estava conectado e o aparelho foi reiniciado, mas o problema persistiu. Após verificar que o sistema estava normal e o problema continuava, foi aberta uma Ordem de Serviço para verificação no local. Será realizado contato com o cliente para agendamento da visita técnica.", "CPE sem sinal - FWA"],
        ["LED 5G - Pis Vermelho - Resolvio (FWA)", "CPE sem sinal - FWA", false, "Reparo Físico", "informou que o LED estava piscando vermelho, indicando ausência de rede. Foi confirmado com a liderança que o status do servidor estava normal (up). Após verificar a situação e realizar os procedimentos necessários, o problema foi resolvido e a conexão foi restabelecida.", "CPE sem sinal - FWA"],
        ["LED 5G - Pis Vermelho - Externo (FWA)", "CPE sem sinal - FWA", true, "Reparo Físico", "relatou que o LED estava piscando vermelho, sinalizando falta de rede. Confirmado com a liderança que o status do servidor estava normal (up). Como o problema persistiu após a verificação interna, foi aberto um chamado externo para a solução do problema. Cliente ciente do chamado e aguarda resolução.", "CPE sem sinal - FWA"],
        ["LENTIDÃO - Resolvido (FWA)", "Lentidão - FWA", false, "Reparo Físico", "relatou lentidão no FWA durante o uso. Após a verificação inicial, foram realizados os procedimentos informados no treinamento, incluindo ajustes no equipamento e testes de conectividade. Com isso, foi possível restabelecer o acesso, e a lentidão foi resolvida. O cliente confirmou que o serviço voltou a operar normalmente, sem mais sinais de instabilidade.", "Lentidão - FWA"],
        ["Lentidão - Externo (FWA)", "Lentidão - FWA", true, "Reparo Físico", "relatou problema de conectividade no FWA. Após verificação detalhada no sistema, constatou-se que o problema está relacionado à conexão externa, fora do controle local. O cliente foi informado que, no momento, não é possível realizar intervenções internas e que a questão envolve apenas a infraestrutura externa. Aguardando ações necessárias pela equipe responsável por essa área.", "Lentidão - FWA"],
        ["Personalização de rede - Nome e Senha (FWA)", "Alterações nas configurações do Wi-Fi - FWA", false, "Reparo Físico", "entrou em contato solicitando a personalização do nome da rede e da senha do WIFI FWA. As configurações foram ajustadas conforme solicitado. O cliente foi informado sobre a alteração e confirmou que a conexão está funcionando corretamente.", "Alterações nas configurações do Wi-Fi - FWA"],
        ["Personalização de rede - Nome (FWA)", "Alterações nas configurações do Wi-Fi - FWA", false, "Reparo Físico", "solicitou a personalização apenas do nome da rede WIFI FWA. O ajuste foi realizado conforme a solicitação, e o cliente foi informado sobre a mudança. Após verificar a conexão, o cliente confirmou que está tudo OK e que a rede está funcionando perfeitamente.", "Alterações nas configurações do Wi-Fi - FWA"],
        ["Personalização de rede - Senha (FWA)", "Alterações nas configurações do Wi-Fi - FWA", false, "Reparo Físico", "entrou em contato solicitando a personalização do nome da rede e da senha do WIFI FWA. As configurações foram ajustadas conforme solicitado. O cliente foi informado sobre a alteração e confirmou que a conexão está funcionando corretamente.", "Alterações nas configurações do Wi-Fi - FWA"],
        ["Cobrança de reparo (Dentro do prazo)", "COBRANÇA DE REPARO DENTRO DO PRAZO", false, "Reparo Físico", "Entrou em contato cobrando atendimento, visto o mesmo encontrar-se dentro do prazo, informado e reforçado prazo ao cliente, o mesmo ciente. Por gentileza, verificar e priorizar..", "COBRANÇA DE REPARO DENTRO DO PRAZO"],
        ["spam", "Solicitação de dados", false, "Sem serviço", "Atendimento finalizado por spam, cliente encaminhou inúmeras vezes a mesma mensagem tornando inviável prosseguir com o atendimento.", ""],
        ["los com valor", "", false, "L", "", ""],
        ["Nova mensagem", "", false, "Sem serviço", "", ""],
        ["Suspeita de LOS com valor", "Suspeita de LOS", true, "Reparo Físico", "Cliente informa haver um LED vermelho piscando. Questionado se LED LOS estava ativa, se havia ocorrido acidentes ou alguma remoção de equipamento e se havia tido quedas de energias recentes, o cliente informou que tem uma luz vermelha acesa e não para as outras perguntas. Verificada que a rota está normal. Aberto O.S. para verificação no local. Cliente ciente do valor de R$20,00 pelo envio da equipe e pode ser gerado mais valores. Realizar contato para agendamento.", "los"],
        ["COBRANÇA DE REPARO FORA DO PRAZO", "COBRANÇA DE REPARO FORA DO PRAZO", false, "Sem serviço", "Cliente entrou em contato informando que a visita técnica permanece pendente e já se encontra fora do prazo previsto. Realizada cobrança junto à equipe responsável, solicitando prioridade no atendimento devido ao atraso. Cliente orientado a aguardar, sendo informado de que a solicitação está sendo acompanhada até a conclusão da visita.", ""]
    ];

    var base = [];
    for (var i = 0; i < raw.length; i++) {
        var isExt = raw[i][2];
        var tagInt = raw[i][1];
        var srvExt = raw[i][3];
        var tagExt = raw[i][5] || tagInt;
        var titulo = raw[i][0];
        base.push({ id: i, titulo: titulo, etiqueta: tagInt, externo: isExt, servico: srvExt, mensagem: raw[i][4], etiqueta_externo: tagExt });
    }

    var themeStyles = {
        black_red: { bg: '#08060f', border: '#dc2626', text: '#f1f5f9', inBg: '#1a0505', inBdr: '#991b1b', btnBg: '#0284c7', headTxt: '#fca5a5', glow: 'rgba(220,38,38,0.45)', btnBorder: '#dc2626' },
        light_basic: { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', inBg: '#f8fafc', inBdr: '#94a3b8', btnBg: '#2563eb', headTxt: '#1e293b', glow: 'rgba(148,163,184,0.3)', btnBorder: '#2563eb' },
        dark_basic: { bg: '#121212', border: '#333333', text: '#e0e0e0', inBg: '#1e1e1e', inBdr: '#444444', btnBg: '#3b82f6', headTxt: '#f3f4f6', glow: 'rgba(0,0,0,0.5)', btnBorder: '#555555' },
        white_blue: { bg: '#ffffff', border: '#0284c7', text: '#0f172a', inBg: '#f0f9ff', inBdr: '#0284c7', btnBg: '#0284c7', headTxt: '#0369a1', glow: 'rgba(2,132,199,0.3)', btnBorder: '#0284c7' },
        purple_black: { bg: '#090514', border: '#7e22ce', text: '#e9d5ff', inBg: '#1e1035', inBdr: '#6b21a8', btnBg: '#9333ea', headTxt: '#d8b4fe', glow: 'rgba(126,34,206,0.5)', btnBorder: '#a855f7' },
        green_yellow: { bg: '#022c22', border: '#eab308', text: '#fef08a', inBg: '#064e3b', inBdr: '#854d0e', btnBg: '#15803d', headTxt: '#fef08a', glow: 'rgba(234,179,8,0.4)', btnBorder: '#eab308' },
        black_blue: { bg: '#030712', border: '#0284c7', text: '#e0f2fe', inBg: '#0f172a', inBdr: '#0369a1', btnBg: '#0284c7', headTxt: '#38bdf8', glow: 'rgba(2,132,199,0.5)', btnBorder: '#38bdf8' },
        black_yellow_rays: { bg: '#0c0a09', border: '#facc15', text: '#fef08a', inBg: '#1c1917', inBdr: '#ca8a04', btnBg: '#ca8a04', headTxt: '#fef08a', glow: 'rgba(250,204,21,0.6)', btnBorder: '#facc15' },
        orange_5g: { bg: '#431407', border: '#f97316', text: '#ffffff', inBg: '#7c2d12', inBdr: '#c2410c', btnBg: '#ea580c', headTxt: '#ffedd5', glow: 'rgba(249,115,22,0.5)', btnBorder: '#fdba74' },
        custom: { bg: savedBg, border: savedBdr, text: '#ffffff', inBg: '#111827', inBdr: savedBdr, btnBg: savedBdr, headTxt: '#ffffff', glow: savedBdr, btnBorder: savedBdr }
    };

    var iconSVGs = {
        clover: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><path d="M50,50 C20,30 30,10 50,30 C70,10 80,30 50,50 C80,50 70,80 50,60 C30,80 20,50 50,50 Z" fill="#4ade80" stroke="#166534" stroke-width="2"/><path d="M50,50 L50,85" stroke="#166534" stroke-width="4"/></svg>',
        katana: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><path d="M15,85 L85,15 L75,5 L5,75 Z" fill="#94a3b8" stroke="#0f172a" stroke-width="2"/><path d="M10,90 L25,75 L20,70 L5,85 Z" fill="#ef4444" stroke="#000" stroke-width="2"/><circle cx="22" cy="72" r="5" fill="#facc15" stroke="#000" stroke-width="2"/></svg>',
        flag_br: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><rect x="10" y="25" width="80" height="50" fill="#009c3b"/><polygon points="50,30 85,50 50,70 15,50" fill="#ffdf00"/><circle cx="50" cy="50" r="12" fill="#002776"/></svg>',
        flag_jp: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><rect x="10" y="25" width="80" height="50" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="#bc002d"/></svg>',
        soccer: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><circle cx="50" cy="50" r="42" fill="#fff" stroke="#0f172a" stroke-width="4"/><polygon points="50,30 35,40 40,60 60,60 65,40" fill="#0f172a"/><line x1="50" y1="30" x2="50" y2="8" stroke="#0f172a" stroke-width="3"/><line x1="35" y1="40" x2="12" y2="35" stroke="#0f172a" stroke-width="3"/><line x1="40" y1="60" x2="22" y2="78" stroke="#0f172a" stroke-width="3"/><line x1="60" y1="60" x2="78" y2="78" stroke="#0f172a" stroke-width="3"/><line x1="65" y1="40" x2="88" y2="35" stroke="#0f172a" stroke-width="3"/></svg>',
        volleyball: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><circle cx="50" cy="50" r="42" fill="#fff" stroke="#2563eb" stroke-width="4"/><path d="M 50,8 A 42,42 0 0,1 92,50" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M 8,50 A 42,42 0 0,1 50,92" fill="none" stroke="#2563eb" stroke-width="3"/><path d="M 20,20 Q 50,50 80,80" fill="none" stroke="#2563eb" stroke-width="3"/></svg>',
        basketball: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><circle cx="50" cy="50" r="42" fill="#ea580c" stroke="#000" stroke-width="4"/><line x1="8" y1="50" x2="92" y2="50" stroke="#000" stroke-width="3"/><line x1="50" y1="8" x2="50" y2="92" stroke="#000" stroke-width="3"/><path d="M 25,12 A 42,42 0 0,1 25,88" fill="none" stroke="#000" stroke-width="3"/><path d="M 75,12 A 42,42 0 0,0 75,88" fill="none" stroke="#000" stroke-width="3"/></svg>',
        brisanet: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><circle cx="50" cy="50" r="42" fill="#0284c7"/><path d="M20,65 Q50,20 80,65" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round"/><path d="M32,65 Q50,35 68,65" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="65" r="6" fill="#ffffff"/></svg>',
        gamepad: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><rect x="10" y="30" width="80" height="45" rx="15" fill="#334155"/><circle cx="30" cy="52" r="10" fill="#000"/><polygon points="30,44 26,52 34,52" fill="#fff"/><circle cx="70" cy="46" r="4" fill="#ef4444"/><circle cx="78" cy="54" r="4" fill="#eab308"/><circle cx="62" cy="54" r="4" fill="#3b82f6"/><circle cx="70" cy="62" r="4" fill="#22c55e"/></svg>',
        dragon: '<svg viewBox="0 0 100 100" class="hud-icon" style="background:#fff;border-radius:50%;"><path d="M20,50 Q40,10 60,30 T80,50 Q60,90 40,70 T20,50" fill="none" stroke="#ef4444" stroke-width="5"/><circle cx="70" cy="35" r="4" fill="#000"/><path d="M70,25 L85,15 M75,20 L90,25" stroke="#ef4444" stroke-width="3"/></svg>'
    };

    function applyLiveStyle(thmKey, icnKey, fntKey, cBg, cBdr) {
        localStorage.setItem('y_hud_theme', thmKey);
        localStorage.setItem('y_hud_icon', icnKey);
        localStorage.setItem('y_hud_font', fntKey);
        if (cBg) localStorage.setItem('y_hud_c_bg', cBg);
        if (cBdr) localStorage.setItem('y_hud_c_bdr', cBdr);

        var curT = themeStyles[thmKey] || themeStyles.black_red;
        if (thmKey === 'custom') {
            curT.bg = cBg || savedBg;
            curT.border = cBdr || savedBdr;
            curT.inBdr = cBdr || savedBdr;
            curT.btnBg = cBdr || savedBdr;
            curT.btnBorder = cBdr || savedBdr;
            curT.glow = cBdr || savedBdr;
        }

        var curFont = fontFamilies[fntKey] || fontFamilies.cyber;
        var curSize = fontSizes[fntKey] || fontSizes.cyber;
        var fL = d.getElementById('m-custom-font');
        if (fL) fL.href = fontLinks[fntKey] || fontLinks.cyber;

        var styleTag = d.getElementById('m-yoda-circuit-hud');
        if (styleTag) {
            styleTag.innerHTML = `
                #m-ui, #m-btn, #m-iframe-modal {
                    --bg:${curT.bg}; --border:${curT.border}; --text:${curT.text};
                    --inBg:${curT.inBg}; --inBdr:${curT.inBdr}; --btnBg:${curT.btnBg};
                    --headTxt:${curT.headTxt}; --glow:${curT.glow}; --btnBorder:${curT.btnBorder};
                    --fFamily:${curFont}; --fSize:${curSize};
                }
                #m-ui{position:fixed;bottom:80px;right:20px;width:370px;background-color:var(--bg);border:2px solid var(--border);border-radius:6px;padding:16px;z-index:2147483647;font-family:var(--fFamily);font-size:var(--fSize);box-shadow:0 0 25px var(--glow);color:var(--text);box-sizing:border-box}
                #m-ui input:not([type="radio"]):not([type="checkbox"]),#m-ui textarea,#m-ui select{width:100%;margin:4px 0 8px;padding:7px;background:var(--inBg);color:var(--text);border:1px solid var(--inBdr);border-radius:4px;outline:none;font-family:inherit;font-size:var(--fSize);box-sizing:border-box}
                #m-ui input:focus,#m-ui textarea:focus,#m-ui select:focus{border-color:var(--border);box-shadow:0 0 8px var(--glow)}
                #m-head{display:flex;justify-content:space-between;font-weight:700;color:var(--headTxt);margin-bottom:12px;border-bottom:2px solid var(--border);padding-bottom:6px}
                .seg{display:flex;border:1px solid var(--inBdr);border-radius:4px;overflow:hidden;margin-bottom:8px}
                .seg label{flex:1;text-align:center;padding:7px;margin:0;cursor:pointer;color:var(--text);font-size:calc(var(--fSize) - 1px);background:var(--inBg);text-transform:uppercase;transition:0.2s}
                .seg input[type="radio"]{display:none}
                .seg input[type="radio"]:checked+label{background:var(--border);color:#fff;font-weight:700}
                .tw{display:flex;align-items:center;gap:6px;font-size:calc(var(--fSize) - 1px);color:var(--headTxt);text-transform:uppercase}
                .tg{position:relative;width:28px;height:16px;background:var(--inBg);border:1px solid var(--inBdr);border-radius:8px;cursor:pointer;margin:0;transition:0.2s}
                .tg::after{content:"";position:absolute;top:2px;left:2px;width:10px;height:10px;background:var(--border);border-radius:50%;transition:0.2s}
                input[type="checkbox"]:checked+.tg{background:var(--border)}
                input[type="checkbox"]:checked+.tg::after{left:14px;background:#fff}
                input[type="checkbox"]{display:none}
                #m-go{width:100%;background:var(--btnBg);color:#fff;border:none;border-radius:4px;padding:12px;font-weight:700;font-size:calc(var(--fSize) + 1px);cursor:pointer;text-transform:uppercase;box-shadow:0 0 12px var(--glow);margin-top:4px;transition:0.2s}
                #m-go:hover{filter:brightness(1.2)}
                #m-btn{position:fixed;bottom:20px;right:20px;z-index:2147483647;width:60px;height:60px;background:var(--bg);border:2px solid var(--btnBorder);border-radius:50%;cursor:pointer;box-shadow:0 0 15px var(--glow);display:flex;align-items:center;justify-content:center;transition:0.3s;padding:6px}
                #m-btn:hover{box-shadow:0 0 25px var(--glow);transform:scale(1.05)}
                .hud-icon{width:80%;height:80%;border-radius:50%;object-fit:cover;}
                .ia-box{background:var(--inBg);border:1px solid var(--btnBg);border-radius:4px;padding:6px;margin-bottom:8px}
                .ia-title{color:var(--headTxt);font-size:calc(var(--fSize) - 1px);font-weight:bold}
                .ia-textarea{margin-top:4px!important;margin-bottom:4px!important;border-color:var(--btnBg)!important}
                .ia-btn{background:var(--btnBg)!important;color:#fff!important;font-size:calc(var(--fSize) - 1px)!important;padding:6px!important;margin:0!important;border:1px solid var(--btnBg)!important;width:100%;cursor:pointer;border-radius:4px;font-weight:bold;transition:0.2s}
                .ia-btn:hover{filter:brightness(1.2)}
                .util-btn{flex:1;margin:0;background:var(--inBg)!important;color:var(--text)!important;border:1px solid var(--inBdr)!important;font-size:calc(var(--fSize) - 1px)!important;padding:8px!important;cursor:pointer;border-radius:4px;font-weight:bold;transition:0.2s}
                .util-btn:hover{border-color:var(--btnBg)!important;color:var(--btnBg)!important}
                .cfg-sel{font-size:calc(var(--fSize) - 2px)!important;padding:3px!important;margin:0!important;width:100%!important;display:block;cursor:pointer;background:var(--inBg);color:var(--text);border:1px solid var(--inBdr);margin-bottom:4px!important}
                .tab-btn{flex:1;background:var(--inBg);color:var(--text);border:1px solid var(--inBdr);padding:6px;font-size:calc(var(--fSize) - 2px);font-family:var(--fFamily);cursor:pointer;border-radius:4px;font-weight:bold;transition:0.2s;margin:0;}
                .tab-btn:hover,.tab-btn.active{background:var(--btnBg);color:#fff;}
                #tag-display { font-size: calc(var(--fSize) - 2px); color: var(--text); background: var(--inBg); border: 1px solid var(--inBdr); padding: 6px; border-radius: 4px; margin-bottom: 6px; text-align: center; }
            `;
        }
        var btn = d.getElementById('m-btn');
        if (btn) btn.innerHTML = iconSVGs[icnKey] || iconSVGs.clover;
    }

    var s = d.createElement('style');
    s.id = 'm-yoda-circuit-hud';
    d.head.appendChild(s);
    
    var b = d.createElement('div');
    b.id = 'm-btn';
    d.body.appendChild(b);

    var p = d.createElement('div');
    p.id = 'm-ui';
    p.style.display = 'block';

    p.innerHTML = `
        <div id="m-head"><span>[ YODA HUD ]</span><span id="m-x" style="cursor:pointer;color:var(--headTxt)">[X]</span></div>
        <div style="display:flex;gap:4px;margin-bottom:8px;">
            <button type="button" id="tab-main" class="tab-btn active" style="background:var(--btnBg);color:#fff;">🏷️ REGISTRO</button>
            <button type="button" id="tab-ai" class="tab-btn">🤖 IA GROQ</button>
            <button type="button" id="tab-vis" class="tab-btn">🎨 VIS.</button>
            <button type="button" id="tab-game" class="tab-btn">🎮 JOGO</button>
        </div>
        
        <div id="content-main">
            <div class="seg">
                <input type="radio" name="m-ct" id="ct-tit" value="titular" checked><label for="ct-tit">Titular</label>
                <input type="radio" name="m-ct" id="ct-ter" value="terceiro"><label for="ct-ter">Terceiro</label>
            </div>
            <input id="m-ter" placeholder="Nome do Terceiro..." style="display:none">
            <div class="seg">
                <input type="radio" name="m-tc" id="tc-all" value="all" checked><label for="tc-all">Todos</label>
                <input type="radio" name="m-tc" id="tc-ftth" value="ftth"><label for="tc-ftth">FTTH</label>
                <input type="radio" name="m-tc" id="tc-fwa" value="fwa"><label for="tc-fwa">FWA</label>
            </div>
            <input id="m-sr" placeholder="🔍 Buscar motivo...">
            <select id="m-sm"></select>
            <textarea id="m-msg" rows="4" placeholder="Mensagem de registro..."></textarea>
            
            <div id="tag-display">🏷️ Interna: Nenhuma<br>🚀 Externa: Não se aplica</div>
            
            <div style="display:flex;justify-content:space-between;align-items:center;background:var(--inBg);padding:8px;border:1px solid var(--inBdr);border-radius:4px;margin-bottom:8px">
                <div class="tw">Ext<input type="checkbox" id="m-ext"><label class="tg" for="m-ext"></label></div>
                <div class="tw">Agd<input type="checkbox" id="m-ag"><label class="tg" for="m-ag"></label></div>
            </div>
            
            <textarea id="m-obs" rows="1" placeholder="Observação (opcional)..."></textarea>
            <div style="display:flex;gap:6px;margin-bottom:6px;">
                <button type="button" id="m-saski" class="util-btn">SASKI [F3]</button>
                <button type="button" id="m-wookie" class="util-btn">PASTOR [F4]</button>
            </div>
            <button id="m-go">FINALIZAR E REGISTRAR</button>
        </div>
        
        <div id="content-ai" style="display:none;">
            <input type="text" id="groq-key" placeholder="API Key Groq (gsk_...)" style="margin-bottom:8px;">
            <textarea id="groq-chat" class="ia-textarea" rows="4" placeholder="Cole o histórico do chat bruto aqui..."></textarea>
            <button type="button" id="groq-btn" class="ia-btn">GERAR RELATO TÉCNICO</button>
            <div id="groq-res-box" style="display:none;margin-top:8px;">
                <span style="font-size:10px;color:var(--headTxt);">Resultado:</span>
                <textarea id="groq-out" class="ia-textarea" rows="5" readonly></textarea>
                <div style="display:flex;gap:4px;">
                    <button type="button" id="groq-copy" class="util-btn">COPIAR</button>
                    <button type="button" id="groq-use" class="util-btn" style="background:var(--btnBg)!important;color:#fff!important;">USAR NO REGISTRO</button>
                </div>
            </div>
        </div>
        
        <div id="content-vis" style="display:none;">
            <div style="display:flex;gap:4px;margin-bottom:6px;">
                <select id="m-sel-thm" class="cfg-sel">
                    <option value="black_red">Preto/Vermelho</option>
                    <option value="light_basic">Claro Básico</option>
                    <option value="dark_basic">Escuro Básico</option>
                    <option value="white_blue">Branco/Azul</option>
                    <option value="purple_black">Roxo/Preto</option>
                    <option value="green_yellow">Verde/Amarelo</option>
                    <option value="black_blue">Preto/Azul</option>
                    <option value="black_yellow_rays">Preto/Amarelo⚡</option>
                    <option value="orange_5g">Laranja 5G</option>
                    <option value="custom">ARGB Custom</option>
                </select>
                <select id="m-sel-icn" class="cfg-sel">
                    <option value="clover">Trevo 🍀</option>
                    <option value="katana">Katana ⚔️</option>
                    <option value="flag_br">Brasil 🇧🇷</option>
                    <option value="flag_jp">Japão 🇯🇵</option>
                    <option value="soccer">Futebol ⚽</option>
                    <option value="volleyball">Vôlei 🏐</option>
                    <option value="basketball">Basquete 🏀</option>
                    <option value="brisanet">Brisanet 📡</option>
                    <option value="gamepad">Controle 🎮</option>
                    <option value="dragon">Dragão 🐉</option>
                </select>
                <select id="m-sel-fnt" class="cfg-sel">
                    <option value="cyber">Cyber</option>
                    <option value="old">Retro</option>
                    <option value="common">Comum</option>
                    <option value="signature">Assinatura</option>
                    <option value="cloister">Cloister Black</option>
                </select>
            </div>
            <div id="m-custom-colors" style="display:none;gap:6px;margin-bottom:6px;align-items:center;">
                <span style="font-size:9px;">Fundo:</span><input type="color" id="m-clr-bg" value="${savedBg}" style="width:30px;height:20px;padding:0;margin:0;cursor:pointer;">
                <span style="font-size:9px;">Borda:</span><input type="color" id="m-clr-bdr" value="${savedBdr}" style="width:30px;height:20px;padding:0;margin:0;cursor:pointer;">
            </div>
        </div>

        <div id="content-game" style="display:none;">
            <div style="text-align:center; font-weight:bold; margin-bottom:4px;">NÍVEL: <span id="g-level">1</span> | PONTOS: <span id="g-score">0</span></div>
            <canvas id="gameCanvas" width="330" height="150" style="background:#87CEEB; border-radius:4px; display:block; margin:0 auto; cursor:pointer;"></canvas>
            <div style="font-size: 10px; margin-top: 10px; line-height:1.4;">
                <b style="color:var(--btnBg);">🎮 Regras do Jogo:</b> O objetivo é chegar à casa do cliente! Pressione <kbd>Espaço</kbd> ou clique no céu azul para pular. A cada nível a velocidade e a distância aumentam. São 100 níveis, e surgem novos obstáculos no caminho (🚧 🐕 🚗). <br><br>
                <b style="color:#ef4444;">👻 Regras Ghostbu:</b> Caso o cliente não responda (Ghosting), aguarde o tempo regulamentar estipulado pela operação, envie a mensagem de alerta de inatividade, e finalize com a etiqueta "Inatividade Chat" <b>sem</b> acionar o reparo externo.
            </div>
        </div>
    `;

    d.body.appendChild(p);
    applyLiveStyle(savedThm, savedIcn, savedFnt, savedBg, savedBdr);

    var stThm = d.getElementById('m-sel-thm'), stIcn = d.getElementById('m-sel-icn'), stFnt = d.getElementById('m-sel-fnt'), cColors = d.getElementById('m-custom-colors'), cBg = d.getElementById('m-clr-bg'), cBdr = d.getElementById('m-clr-bdr');

    if (savedThm === 'custom' && cColors) cColors.style.display = 'flex';

    if (stThm) {
        stThm.value = savedThm;
        stThm.onchange = function () {
            if (this.value === 'custom') cColors.style.display = 'flex';
            else cColors.style.display = 'none';
            applyLiveStyle(this.value, stIcn.value, stFnt.value, cBg.value, cBdr.value);
        };
    }
    if (stIcn) {
        stIcn.value = savedIcn;
        stIcn.onchange = function () { applyLiveStyle(stThm.value, this.value, stFnt.value, cBg.value, cBdr.value); };
    }
    if (stFnt) {
        stFnt.value = savedFnt;
        stFnt.onchange = function () { applyLiveStyle(stThm.value, stIcn.value, this.value, cBg.value, cBdr.value); };
    }
    if (cBg) {
        cBg.oninput = function () { applyLiveStyle('custom', stIcn.value, stFnt.value, this.value, cBdr.value); };
    }
    if (cBdr) {
        cBdr.oninput = function () { applyLiveStyle('custom', stIcn.value, stFnt.value, cBg.value, this.value); };
    }

    // GESTÃO DE ABAS E PAUSA DO JOGO
    function switchTab(showId, btnId) {
        ['content-main', 'content-ai', 'content-vis', 'content-game'].forEach(id => d.getElementById(id).style.display = 'none');
        ['tab-main', 'tab-ai', 'tab-vis', 'tab-game'].forEach(id => {
            d.getElementById(id).style.background = 'var(--inBg)';
            d.getElementById(id).style.color = 'var(--text)';
        });
        d.getElementById(showId).style.display = 'block';
        d.getElementById(btnId).style.background = 'var(--btnBg)';
        d.getElementById(btnId).style.color = '#fff';
        
        if (showId === 'content-game') { startGameLoop(); } else { stopGameLoop(); }
    }

    d.getElementById('tab-main').onclick = function () { switchTab('content-main', 'tab-main'); };
    d.getElementById('tab-ai').onclick = function () { switchTab('content-ai', 'tab-ai'); };
    d.getElementById('tab-vis').onclick = function () { switchTab('content-vis', 'tab-vis'); };
    d.getElementById('tab-game').onclick = function () { switchTab('content-game', 'tab-game'); };

    // ==========================================
    // LÓGICA DO JOGO (INTERNET REPAIR RUNNER)
    // ==========================================
    const cvs = d.getElementById('gameCanvas');
    const ctx = cvs.getContext('2d');
    let loopId = null;
    let frame = 0;
    let level = 1;
    let score = 0;
    let gameSpeed = 4;
    let gameOver = false;
    let gameWin = false;
    let targetDist = 0;
    
    let dino = { x: 30, y: 110, w: 20, h: 20, dy: 0, jumpF: -8.5, gravity: 0.5, grounded: true };
    let obstacles = [];
    let house = null;

    function resetGame(nextLevel = false) {
        if (nextLevel) level++;
        else level = 1;
        
        score = 0;
        gameSpeed = 4 + (level * 0.3);
        targetDist = 300 + (level * 50); 
        gameOver = false;
        gameWin = false;
        obstacles = [];
        house = null;
        dino.y = 110;
        dino.dy = 0;
        dino.grounded = true;
        d.getElementById('g-level').innerText = level;
    }

    function jump() {
        if (gameOver || gameWin) { resetGame(gameWin); return; }
        if (dino.grounded) { dino.dy = dino.jumpF; dino.grounded = false; }
    }

    cvs.addEventListener('mousedown', jump);
    d.addEventListener('keydown', function(e){
        if(e.code === 'Space' && d.getElementById('content-game').style.display === 'block') {
            e.preventDefault(); jump();
        }
    });

    function spawnObstacle() {
        let type = '🚧'; // Nivel 1
        if (level > 20 && Math.random() > 0.5) type = '🐕'; // Nivel 21+ cães
        if (level > 50 && Math.random() > 0.8) type = '🚗'; // Nivel 51+ carros
        obstacles.push({ x: cvs.width, y: 110, w: 20, h: 20, text: type });
    }

    function updateGame() {
        if (gameOver || gameWin) return;
        frame++;
        score++;
        d.getElementById('g-score').innerText = score;

        // Limpar canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        
        // Chão
        ctx.fillStyle = '#654321';
        ctx.fillRect(0, 130, cvs.width, 20);

        // Física Técnico
        dino.dy += dino.gravity;
        dino.y += dino.dy;
        if (dino.y >= 110) { dino.y = 110; dino.dy = 0; dino.grounded = true; }
        
        ctx.font = "20px Arial";
        ctx.fillText("🏃", dino.x, dino.y + 18);

        // Verificação de Vitória (Chegar à casa)
        if (score >= targetDist && !house) {
            house = { x: cvs.width, y: 90, w: 40, h: 40 };
        }

        if (house) {
            house.x -= gameSpeed;
            ctx.font = "40px Arial";
            ctx.fillText("🏠", house.x, house.y + 35);
            if (house.x <= dino.x + dino.w) {
                gameWin = true;
                ctx.fillStyle = "rgba(0,0,0,0.7)";
                ctx.fillRect(0,0,cvs.width,cvs.height);
                ctx.fillStyle = "white";
                ctx.font = "20px Arial";
                ctx.fillText("NET REPARADA! Nível " + level + " ✔️", 40, 70);
                ctx.font = "14px Arial";
                ctx.fillText("Clique para o Nível " + (level+1), 90, 100);
            }
        } else {
            // Gerar Obstáculos
            if (frame % (Math.max(40, 100 - (level*2))) === 0 && Math.random() > 0.3) { spawnObstacle(); }
            
            for (let i = 0; i < obstacles.length; i++) {
                let obs = obstacles[i];
                obs.x -= gameSpeed;
                ctx.font = "20px Arial";
                ctx.fillText(obs.text, obs.x, obs.y + 18);

                // Colisão (caixas de colisão ajustadas)
                if (dino.x < obs.x + obs.w - 5 && dino.x + dino.w - 5 > obs.x &&
                    dino.y < obs.y + obs.h - 5 && dino.y + dino.h - 5 > obs.y) {
                    gameOver = true;
                    ctx.fillStyle = "rgba(255,0,0,0.5)";
                    ctx.fillRect(0,0,cvs.width,cvs.height);
                    ctx.fillStyle = "white";
                    ctx.font = "20px Arial";
                    ctx.fillText("CRASH! Cliente sem net ❌", 40, 70);
                    ctx.font = "14px Arial";
                    ctx.fillText("Clique para tentar de novo", 80, 100);
                }
            }
            // Limpeza arrays
            obstacles = obstacles.filter(o => o.x > -30);
        }
    }

    function gameLoop() {
        updateGame();
        loopId = requestAnimationFrame(gameLoop);
    }

    function startGameLoop() { if (!loopId) { resetGame(); gameLoop(); } }
    function stopGameLoop() { if (loopId) { cancelAnimationFrame(loopId); loopId = null; } }
    // ==========================================

    var gk = localStorage.getItem('groq_api_key');
    if (gk) d.getElementById('groq-key').value = gk;

    d.getElementById('groq-btn').onclick = async function () {
        var apiKey = d.getElementById('groq-key').value.trim();
        var chatText = d.getElementById('groq-chat').value.trim();
        if (!apiKey) { alert('Insira a chave da Groq!'); return; }
        if (!chatText) { alert('Cole o chat!'); return; }
        localStorage.setItem('groq_api_key', apiKey);
        
        var btn = this;
        var oldTxt = btn.innerText;
        btn.innerText = '⏳ PROCESSANDO...';
        btn.disabled = true;
        
        d.getElementById('groq-res-box').style.display = 'block';
        d.getElementById('groq-out').value = 'Analisando...';
        
        var prompt = 'Você é um sistema automatizado de Documentação Técnica para Call Center de Suporte. Seu único trabalho é ler históricos de chats de atendimento e gerar um RELATO TÉCNICO EM PARÁGRAFO ÚNICO para o histórico do chamado.\n\nRegras absolutas:\n1. ANONIMATO TOTAL: Remova nomes de clientes, atendentes, telefones, e-mails, números de documentos ou CPFs. Refira-se aos envolvidos apenas como "O cliente" e "O suporte".\n2. FOCO TÉCNICO: Narre em terceira pessoa o sintoma técnico relatado, os testes ou diagnósticos feitos e a solução final aplicada.\n3. FORMATO: Escreva em um único parágrafo contínuo, sem tópicos, sem traços (-), sem asteriscos (*) e sem quebras de linha. Responda apenas com o resumo técnico, sem mensagens adicionais ou introduções de IA.';
        
        try {
            var res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
                body: JSON.stringify({ model: 'openai/gpt-oss-20b', messages: [{ role: 'system', content: prompt }, { role: 'user', content: 'Gere o relato técnico deste chat:\n\n' + chatText }], temperature: 0.1 })
            });
            var data = await res.json();
            if (data.choices && data.choices[0]) {
                d.getElementById('groq-out').value = data.choices[0].message.content.trim();
            } else {
                d.getElementById('groq-out').value = 'Erro: ' + (data.error ? data.error.message : 'desconhecido');
            }
        } catch (e) { d.getElementById('groq-out').value = 'Erro de rede: ' + e.message; }
        btn.innerText = oldTxt; btn.disabled = false;
    };

    d.getElementById('groq-copy').onclick = function () {
        navigator.clipboard.writeText(d.getElementById('groq-out').value);
        var b = this; var o = b.innerText; b.innerText = 'COPIADO!';
        setTimeout(function () { b.innerText = o; }, 2000);
    };

    d.getElementById('groq-use').onclick = function () {
        var txt = d.getElementById('groq-out').value;
        setVal(d.getElementById('m-msg'), txt);
        d.getElementById('tab-main').click();
    };

    var im = d.createElement('div');
    im.id = 'm-iframe-modal';
    im.style.cssText = 'display:none;position:fixed;top:5vh;left:10vw;width:80vw;height:90vh;background:var(--bg);border:2px solid var(--border);border-radius:8px;z-index:2147483647;box-shadow:0 0 30px var(--glow);flex-direction:column;overflow:hidden;';
    im.innerHTML = '<div style="display:flex;justify-content:space-between;padding:12px;background:var(--inBg);border-bottom:2px solid var(--border);color:var(--headTxt);font-weight:bold;font-size:14px;"><span id="m-iframe-title">MINI PAGE</span><span id="m-iframe-close" style="cursor:pointer;background:#7f1d1d;padding:2px 8px;border-radius:4px;color:#fff;">FECHAR [X]</span></div><iframe id="m-iframe-src" style="flex:1;width:100%;height:100%;border:none;background:#fff;"></iframe>';
    d.body.appendChild(im);
    
    d.getElementById('m-iframe-close').onclick = function () { im.style.display = 'none'; d.getElementById('m-iframe-src').src = ''; };
    
    function openIframe(url, t) {
        d.getElementById('m-iframe-title').innerText = t;
        d.getElementById('m-iframe-src').src = url;
        im.style.display = 'flex';
    }
    
    d.getElementById('m-saski').onclick = function () { openIframe('https://saski.brisanet.net.br/', 'SASKI (F3)'); };
    d.getElementById('m-wookie').onclick = function () { openIframe('https://pastor.brisanet.net.br/#/wookie/home', 'PASTOR (F4)'); };
    
    d.addEventListener('keydown', function (e) {
        if (e.key === 'F3') { e.preventDefault(); openIframe('https://saski.brisanet.net.br/', 'SASKI (F3)'); }
        if (e.key === 'F4') { e.preventDefault(); openIframe('https://pastor.brisanet.net.br/#/wookie/home', 'PASTOR (F4)'); }
    });

    function renderOpts() {
        var q = (d.getElementById('m-sr').value || '').toLowerCase();
        var tc = d.querySelector('input[name="m-tc"]:checked').value;
        var sel = d.getElementById('m-sm');
        sel.innerHTML = '<option value="">-- Selecione o Motivo --</option>';
        for (var i = 0; i < base.length; i++) {
            var str = (base[i].titulo + ' ' + base[i].servico + ' ' + base[i].mensagem).toLowerCase();
            if (tc !== 'all' && str.indexOf(tc) === -1) continue;
            if (!q || str.indexOf(q) !== -1) sel.innerHTML += '<option value="' + i + '">' + base[i].titulo + '</option>';
        }
    }
    
    renderOpts();
    d.getElementById('m-sr').oninput = renderOpts;
    d.getElementsByName('m-tc').forEach(function (r) {
        r.onchange = function () {
            renderOpts();
            var v = d.getElementById('m-sm').value;
            if (v !== '') updTag(base[parseInt(v)]);
        };
    });

    b.onclick = function () { p.style.display = p.style.display === 'none' ? 'block' : 'none'; };
    d.getElementById('m-x').onclick = function () { p.style.display = 'none'; };
    d.getElementsByName('m-ct').forEach(function (r) {
        r.onchange = function (e) { d.getElementById('m-ter').style.display = e.target.value === 'terceiro' ? 'block' : 'none'; }
    });

    function updTag(item) {
        if (!item) return;
        var ext = d.getElementById('m-ext').checked;
        var intTag = item.etiqueta || item.titulo;
        var extTag = item.etiqueta_externo || intTag;
        var serv = item.servico || "Reparo Físico";
        var disp = d.getElementById('tag-display');
        
        if (ext) {
            disp.innerHTML = `🏷️ Interna: <b>${intTag}</b><br>🚀 Externa: <b>${extTag} (${serv.toLowerCase()})</b>`;
        } else {
            disp.innerHTML = `🏷️ Interna: <b>${intTag}</b><br>🚀 Externa: <i>Não se aplica</i>`;
        }
    }

    d.getElementById('m-sm').onchange = function () {
        var v = this.value;
        if (v !== '') {
            var item = base[parseInt(v)];
            d.getElementById('m-msg').value = item.mensagem || '';
            d.getElementById('m-ext').checked = item.externo;
            updTag(item);
        } else {
            d.getElementById('m-msg').value = '';
            d.getElementById('tag-display').innerHTML = '🏷️ Interna: Nenhuma<br>🚀 Externa: Não se aplica';
            d.getElementById('m-ext').checked = false;
        }
    };

    d.getElementById('m-ext').onchange = function () {
        var v = d.getElementById('m-sm').value;
        if (v !== '') updTag(base[parseInt(v)]);
    };

    function normStr(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ');
    }

    function setVal(el, val) {
        if (!el) return;
        try { el.focus(); } catch (e) {}
        var proto = el.tagName.toLowerCase() === 'textarea' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
        if (setter) setter.call(el, val); else el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function processTags(item, cb) {
        var tag = item ? (item.etiqueta || item.titulo) : '';
        if (!tag) return cb ? cb() : null;
        var pb = d.querySelector('nz-tag.editable-tag') || d.querySelector('i.anticon-plus')?.closest('nz-tag') || d.querySelector('.editable-tag');
        if (pb) pb.click();
        
        var att = 0, int1 = setInterval(function () {
            att++;
            var mod = d.querySelector('.ant-modal-content');
            var ts = d.querySelector('#tags') || d.querySelector('nz-select[id="tags"]');
            if (!ts && mod) {
                var ss = mod.querySelectorAll('nz-select');
                ts = ss.length >= 2 ? ss[1] : ss[0];
            }
            if (ts || att >= 20) {
                clearInterval(int1);
                var tr = ts ? ts.querySelector('.ant-select-selection') : null;
                if (tr) tr.click();
                var inp = ts ? ts.querySelector('input') : null;
                if (inp) setVal(inp, tag);
                
                setTimeout(function () {
                    var panes = d.querySelectorAll('.cdk-overlay-pane');
                    var activePane = panes[panes.length - 1];
                    var match = null;
                    var tg = normStr(tag);
                    if (activePane) {
                        var opts = activePane.querySelectorAll('li');
                        for (var k = 0; k < opts.length; k++) {
                            if (opts[k].offsetWidth > 0) {
                                var txt = normStr(opts[k].innerText || opts[k].textContent);
                                if (txt === tg || txt.indexOf(tg) === 0 || (tg.length >= 3 && txt.indexOf(tg) !== -1)) {
                                    match = opts[k];
                                    break;
                                }
                            }
                        }
                    }
                    if (match) {
                        try { match.scrollIntoView({ block: 'nearest' }); } catch (e) {}
                        match.click();
                        setTimeout(function () {
                            var btns = d.querySelectorAll('.ant-modal-content button');
                            for (var i = 0; i < btns.length; i++) {
                                if (btns[i].textContent.toLowerCase().indexOf('concluir') !== -1) {
                                    btns[i].disabled = false;
                                    btns[i].click();
                                    break;
                                }
                            }
                            if (cb) setTimeout(cb, 1000);
                        }, 800);
                    } else {
                        var btns = d.querySelectorAll('.ant-modal-content button');
                        for (var i = 0; i < btns.length; i++) {
                            if (btns[i].textContent.toLowerCase().indexOf('concluir') !== -1) {
                                btns[i].disabled = false;
                                btns[i].click();
                                break;
                            }
                        }
                        if (cb) setTimeout(cb, 1000);
                    }
                }, 1500);
            }
        }, 200);
    }

    async function handleExternalFlow(item) {
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        console.log("%c[Automação] Iniciando fluxo externo...", "color: #38bdf8; font-weight: bold;");

        function isVisible(el) {
            if (!el) return false;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            const rect = el.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }

        function clickReal(el) {
            if (!el) return;
            try { el.scrollIntoView({ behavior: 'instant', block: 'center' }); } catch(e){}
            const opts = { bubbles: true, cancelable: true, view: window };
            el.dispatchEvent(new MouseEvent('mouseenter', opts));
            el.dispatchEvent(new MouseEvent('mouseover', opts));
            el.dispatchEvent(new MouseEvent('mousedown', opts));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.click();
            el.dispatchEvent(new Event('change', opts));
        }

        function setValInput(el, val) {
            if (!el) return;
            try { el.focus(); } catch (e) {}
            var setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
            if (setter) setter.call(el, val);
            else el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
        }

        async function esperar(fn, timeout = 7000) {
            const start = Date.now();
            while (Date.now() - start < timeout) {
                try {
                    const el = fn();
                    if (el && isVisible(el)) return el;
                } catch (e) {}
                await sleep(150);
            }
            return null;
        }

        function buscarOpcaoDropdown(textoAlvo, estrito = false) {
            const overlays = Array.from(document.querySelectorAll('.cdk-overlay-pane, .cdk-overlay-container')).filter(isVisible);
            const container = overlays[overlays.length - 1] || document;
            const itens = Array.from(container.querySelectorAll('li.ant-select-dropdown-menu-item, li, nz-option-item, [role="option"]')).filter(isVisible);
            const alvo = textoAlvo.trim().toLowerCase();
            
            let match = itens.find(el => (el.innerText || el.textContent || '').trim().toLowerCase() === alvo);
            if (match) return match;
            
            if (!estrito) {
                match = itens.find(el => (el.innerText || el.textContent || '').trim().toLowerCase().startsWith(alvo));
                if (match) return match;
                match = itens.find(el => (el.innerText || el.textContent || '').trim().toLowerCase().includes(alvo));
            }
            return match || null;
        }

        try {
            var tagToFind = (document.getElementById('m-ext').checked && item.etiqueta_externo) ? item.etiqueta_externo : (item.etiqueta || item.titulo);
            var servToFind = (item && item.servico) ? item.servico : 'Reparo Físico';
            
            document.getElementById('m-ui').style.display = 'none';

            const modalAberto = document.querySelector('app-new-schedule, nz-modal');
            if (!modalAberto) {
                console.log("[1] Clicando em Enviar...");
                const btnEnviar = await esperar(() => {
                    let b1 = document.querySelector("div#forward, #forward span, #forward, .item.forward");
                    if(b1) return b1;
                    let b2 = document.getElementById('forward');
                    if(b2) return b2;
                    let spans = Array.from(document.querySelectorAll('span, div, button'));
                    let s = spans.find(x => {
                        let txt = (x.textContent||'').trim().toLowerCase();
                        return (txt === 'enviar' || txt === 'encaminhar') && isVisible(x);
                    });
                    return s ? (s.closest('.item.forward') || s) : null;
                });
                
                if(!btnEnviar) throw new Error("Botão Enviar não encontrado.");
                clickReal(btnEnviar);
                await sleep(600);

                console.log("[2] Abrindo Setor...");
                const selectSetor = await esperar(() => document.querySelector("nz-select#sector .ant-select-selection, nz-select#sector"));
                if (selectSetor) {
                    clickReal(selectSetor);
                    await sleep(400);
                    console.log("[3] Selecionando Suporte Externo...");
                    const optSetor = await esperar(() => buscarOpcaoDropdown("Suporte Externo"));
                    if(optSetor) clickReal(optSetor);
                    await sleep(600);
                }
            }

            console.log("[4] Configurando Problema...");
            const selectProblema = document.querySelector("nz-select#problem");
            const problemaJaSelecionado = selectProblema && (selectProblema.innerText || '').toLowerCase().includes(tagToFind.toLowerCase());
            
            if (!problemaJaSelecionado) {
                const triggerProblema = await esperar(() => document.querySelector("nz-select#problem .ant-select-selection, nz-select#problem > div, nz-select#problem"));
                if (triggerProblema) {
                    clickReal(triggerProblema);
                    await sleep(500);
                    
                    console.log("[5] Selecionando: " + tagToFind);
                    const optProblema = await esperar(() => 
                        buscarOpcaoDropdown(tagToFind + " (reparo físico)", true) || 
                        buscarOpcaoDropdown(tagToFind + " (" + servToFind.toLowerCase() + ")", true) || 
                        buscarOpcaoDropdown(tagToFind)
                    );
                    
                    if(optProblema) clickReal(optProblema);
                    await sleep(500);
                    
                    const tituloModal = document.querySelector('.ant-modal-title, app-new-schedule h1, app-new-schedule p');
                    if (tituloModal) clickReal(tituloModal);
                    await sleep(400);
                }
            }

            console.log("[6] Configurando Serviço...");
            const selectServico = document.querySelector("nz-select#service");
            const servicoJaSelecionado = selectServico && (selectServico.innerText || '').toLowerCase().includes(servToFind.toLowerCase());
            
            if (!servicoJaSelecionado) {
                const jaAberto = buscarOpcaoDropdown(servToFind, true);
                if (!jaAberto) {
                    const triggerServico = await esperar(() => document.querySelector("nz-select#service .ant-select-selection, nz-select#service > div, nz-select#service"));
                    if (triggerServico) {
                        clickReal(triggerServico);
                        await sleep(500);
                    }
                }
                const optServico = await esperar(() => buscarOpcaoDropdown(servToFind, true) || buscarOpcaoDropdown(servToFind, false));
                if(optServico) clickReal(optServico);
                await sleep(600);
            }

            console.log("[7] Clicando em Continuar...");
            const btnContinuar = await esperar(() => {
                const botoes = Array.from(document.querySelectorAll("app-schedule-footer button, nz-modal button, ion-button button, button"));
                return botoes.find(b => {
                    const txt = (b.innerText || b.textContent || "").trim().toLowerCase();
                    const isContinuar = txt.includes("continuar");
                    const isDisabled = b.disabled || b.hasAttribute('disabled') || b.classList.contains("button-disabled");
                    return isContinuar && !isDisabled && isVisible(b);
                });
            });
            
            if(btnContinuar) {
                clickReal(btnContinuar);
                if (btnContinuar.closest('ion-button')) clickReal(btnContinuar.closest('ion-button'));
            } else {
                throw new Error("Botão Continuar não encontrado.");
            }
            await sleep(1500);

            console.log("[8] Clicando em Agendar...");
            const btnAgendar = await esperar(() => {
                const botoes = Array.from(document.querySelectorAll("app-ray-calendar button, td button, app-ray-data-cell button"));
                return botoes.find(b => (b.innerText || b.textContent || "").toLowerCase().includes("agendar") && isVisible(b));
            });
            
            if(btnAgendar) clickReal(btnAgendar);
            await sleep(600);

            console.log("[9] Escolhendo turno 06:00...");
            const chipHorario = await esperar(() => {
                const chips = Array.from(document.querySelectorAll("ion-chip, [class*='chip'], button"));
                return chips.find(el => (el.innerText || el.textContent || "").includes("06:00") && isVisible(el));
            });
            
            if(chipHorario) clickReal(chipHorario);
            console.log("%c[Automação] Concluída com sucesso!", "color: #22c55e; font-weight: bold;");

        } catch (err) {
            console.error("%c[Automação] Erro no fluxo externo:", "color: #ef4444; font-weight: bold;", err.message);
            alert("Erro na automação externa: " + err.message + "\n\nAbra o console (F12) para ver os detalhes.");
        }
    }

    function toggleAguardar(shouldBeWait) {
        var sw = d.querySelector('button.ant-switch') || d.querySelector('nz-switch button');
        if (sw) {
            var isChecked = sw.classList.contains('ant-switch-checked');
            if (shouldBeWait && !isChecked) {
                sw.click();
            } else if (!shouldBeWait && isChecked) {
                sw.click();
            }
        }
    }

    d.getElementById('m-go').onclick = function () {
        var ct = d.querySelector('input[name="m-ct"]:checked').value;
        var ter = d.getElementById('m-ter').value;
        var smIdx = d.getElementById('m-sm').value;
        var msg = d.getElementById('m-msg').value;
        var ag = d.getElementById('m-ag').checked;
        var obs = d.getElementById('m-obs').value;
        var isExterno = d.getElementById('m-ext').checked;
        
        var fMsg = msg;
        if (ct === 'terceiro' && ter) fMsg = 'Contato com terceiro (' + ter + '): ' + fMsg;
        if (ag) fMsg += '\n(Aguardando resposta do cliente)';
        if (obs) fMsg += '\n\nObs: ' + obs;
        
        toggleAguardar(ag);
        
        var t = d.querySelector('textarea.text-area') || d.querySelector('textarea[placeholder*="mensagem"]');
        if (t) {
            setVal(t, fMsg);
            var item = smIdx !== '' ? base[parseInt(smIdx)] : null;
            setTimeout(function () {
                processTags(item, function () {
                    var sb = d.getElementById('send_button') || d.querySelector('.send-icon')?.closest('button');
                    if (sb) { sb.disabled = false; sb.click(); }
                    
                    setTimeout(function () {
                        if (isExterno && item) {
                            handleExternalFlow(item);
                        } else {
                            var bs = d.querySelectorAll('button, nz-button, span');
                            for (var i = 0; i < bs.length; i++) {
                                if (bs[i].textContent.toLowerCase().indexOf('finalizar') !== -1 && !bs[i].closest('#m-ui')) {
                                    var fb = bs[i].closest('button') || bs[i];
                                    fb.click();
                                    break;
                                }
                            }
                            setTimeout(function () { p.style.display = 'none'; }, 800);
                        }
                    }, 1500);
                });
            }, 500);
        } else {
            alert('Abra a conversa de um chamado para poder registrar.');
        }
    };
})();
