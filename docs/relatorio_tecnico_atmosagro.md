**Monitoramento Avançado e Predição de Risco Agrícola: Tecnologia AtmosAgro** 

**1\. Introdução e Contextualização** 

Perdas agrícolas significativas ocorrem todos os anos devido a **doenças de plantas** e **estresses fisiológicos** (como déficit hídrico e temperaturas extremas). Cultivos como cana-de-açúcar, cebola e algodão enfrentam ameaças que podem reduzir drasticamente a produtividade se não forem detectadas e manejadas a tempo. 

O setor sucroenergético brasileiro, em particular, enfrenta a emergência da **Síndrome da Murcha da Cana (SMC)**, que representa uma ameaça direta à sustentabilidade produtiva. Relatórios recentes indicam que esta patologia, agravada por condições climáticas extremas, chegou a comprometer até **45% da produtividade** em áreas severamente afetadas. 

A plataforma **AtmosAgro** propõe uma solução de **agricultura preditiva**. Utilizando sensoriamento remoto orbital e Inteligência Artificial, a ferramenta busca monitorar vastas extensões de cultivo, identificando sinais de estresse invisíveis ao olho humano para mitigar riscos antes que se tornem prejuízos irreversíveis. 

**2\. Principais Doenças e Desafios por Cultura** 

**2.1. Cana-de-açúcar: O Desafio da Síndrome da Murcha (SMC)** 

A SMC destaca-se como um dos problemas mais críticos. Trata-se de uma síndrome associada a um complexo de fungos, com o Colletotrichum falcatum como agente central, frequentemente em coinfecção com Fusarium spp. e Phaeocytostroma sacchari. 

**Mecanismo da Doença:** O fungo coloniza os tecidos vasculares (xilema) e produz enzimas que hidrolisam a sacarose (inversão), reduzindo drasticamente o Açúcar Total Recuperável (ATR). A planta tenta se defender produzindo gomas e tiloses que bloqueiam seus próprios vasos, causando a **“Seca Fisiológica”** (murcha mesmo com solo úmido). 

**Sintomas Típicos:** 

Murcha e seca de colmos em reboleiras; 

Descoloração interna, com estrias avermelhadas ou marrom-escuro; 

Perda de cera na casca e aspecto opaco; 

Redução do crescimento e falhas no canavial. 

**Porta de Entrada (Vetores Bióticos):** A modelagem preditiva do AtmosAgro considera que esses fungos são oportunistas, dependendo de ferimentos causados por pragas para entrar na planta: 

**Bicudo (Sphenophorus levis):** Ataca a base da touceira e rizomas, facilitando a infecção que sobe pelo sistema vascular. Áreas com histórico de Sphenophorus são “hotspots” de risco para Murcha. 

**Broca-da-Cana (Diatraea saccharalis):** Abre galerias que expõem o parênquima ao fungo. 

Além da SMC, outras doenças importantes incluem **ferrugem marrom**, **mosaico da cana** (virose) e **raquitismo da soqueira** (bacteriose). O **monitoramento integrado** (biótico \+ abiótico) é essencial, pois estresses abióticos (déficit hídrico, encharcamento, extremos de temperatura) frequentemente interagem com essas doenças. 

**2.2. Algodão** 

O algodoeiro enfrenta um conjunto amplo de doenças foliares, vasculares e de solo. Entre as mais importantes: 

**Mancha de ramulária** (Ramularia areola): Causa desfolha intensa, comprometendo enchimento de capulhos. **Mancha angular** (Xanthomonas): Bactéria que provoca lesões angulares nas folhas.  
**Murcha de Fusarium** (Fusarium oxysporum f.sp. vasinfectum): Causa murcha sistêmica e morte de plantas. **Ramulose** (Colletotrichum gossypii): Afeta o ponteiro, provocando seca do meristema. 

**Mofo-branco** (Sclerotinia): Podridões de caule. 

Estresses fisiológicos, como seca durante florescimento, excesso de chuvas na abertura de capulhos e extremos de temperatura, também afetam a cultura. 

**2.3. Cebola** 

A cebola é uma cultura de alto valor, porém sensível a doenças foliares e condições de clima. Entre as principais enfermidades: 

**Míldio** (Peronospora destructor): Produz manchas verde-claras nas folhas e um mofo acinzentado. **Queima das pontas** (Botrytis): Causa necrose iniciando na ponta das folhas. 

**Mancha púrpura** (Alternaria): Provoca lesões concêntricas roxo-escuras. 

**Antracnose**: Deforma e escurece folhas e pescoço. 

A cebola é muito sensível à falta de água devido ao seu sistema radicular raso. 

**3\. Tecnologias Aplicáveis: Sensoriamento Remoto e IA** 

A detecção remota não “vê” o fungo, mas sim a resposta fisiológica da planta ao estresse. A plataforma AtmosAgro utiliza a espectroscopia de reflectância para diferenciar a Murcha da seca comum. 

**3.1. Assinaturas Espectrais Críticas** 

Plantas doentes ou estressadas alteram sua reflexão de luz nas bandas do visível, red-edge, infravermelho próximo (NIR) e SWIR, permitindo identificar: 

| Banda Espectral  | Função no Diagnóstico  | Comportamento em Estresse |
| :---- | :---- | :---- |
| **Red-Edge** (Borda  Vermelha) | Alerta Precoce. Detecta a clorose incipiente e degradação de clorofila. | O ponto de inflexão desloca-se para comprimentos de onda mais curtos**“**( **Blue Shift”**), semanas antes do sintoma visual. |
| **Infravermelho de Ondas Curtas (SWIR)** | Indicador de Água. Mede a água líquida nas folhas. | Uma planta com Murcha reflete **mais luz SWIR** (aparece “clara”), indicando perda de água devido ao bloqueio vascular. |
| **Temperatura da  Superfície (LST)** | Validação. Confirma se o estresse é biótico (doença) ou climático. | O fechamento estomático causado pela doença impede a refrigeração, **elevando a temperatura** da folha. |

**3.2. Satélites e Sensores** 

A infraestrutura do AtmosAgro baseia-se em uma constelação híbrida para garantir frequência e precisão: 

**Sentinel-2 (Espinha Dorsal):** Satélite gratuito com três bandas dedicadas na região do Red-Edge (B5, B6, B7), essenciais para detectar a degradação de clorofila inicial. Possui revisita de 5 dias. 

**PlanetScope (Alta Resolução \- Opcional):** Revisita diária e resolução de 3 metros. Permite detectar o início da infestação em “reboleiras” pequenas ou linhas individuais. 

**3.3. Índices Espectrais de Vegetação** 

Índices espectrais são combinações de bandas que realçam propriedades como vigor, clorofila e água na planta.

| Índice  | Função no Diagnóstico AtmosAgro |
| :---- | :---- |
| **NDWI/NDMI**  (Água) | Indicador Primário. Mede a turgidez celular. **Queda abrupta de NDWI com NDVI estável** indica bloqueio vascular (Murcha). |
| **NDRE** (Clorofila)  | Alerta Precoce. Detecta a clorose incipiente causada pelas toxinas do fungo antes do amarelecimento visível. |
| **NDVI** (Biomassa)  | Referência. Monitora o vigor geral, mas é usado em conjunto com o NDRE para evitar saturação em dosséis densos. |

O pipeline AtmosAgro já calcula índices como **NDVI, NDWI, MSI, EVI, NDRE, NDMI, NDRE1–4, CI\_REDEDGE e SIPI** a partir de Sentinel-2. 

**3.4. Modelagem Preditiva (Machine Learning)** 

Utilizamos algoritmos **Random Forest** e **redes neurais** para cruzar os índices espectrais com dados climáticos (chuva acumulada e temperatura). O modelo aprende os padrões históricos: se um talhão apresenta queda de vigor em um período chuvoso (onde não deveria haver seca), a probabilidade de Murcha é classificada como **ALTA**. 

**4\. A Solução AtmosAgro: Funcionalidades e Valor** 

Toda a complexidade técnica é traduzida em um painel de controle intuitivo. 

**4.1. Funcionalidades do Painel de Controle (Dashboard)** 

**Mapa Interativo de Saúde:** Visualização “Semáforo” (Verde/Amarelo/Vermelho) de toda a propriedade, permitindo triagem imediata de milhares de hectares. 

**Assistente de Diagnóstico com IA:** Um módulo que interpreta os gráficos e fornece conclusões em linguagem natural (ex: “Queda de NDWI detectada. Risco de Murcha Vascular. Ação sugerida: Vistoria.”). 

**Monitoramento Ambiental:** Exibição em tempo real de temperatura (LST), precipitação e umidade do solo para cada talhão. 

**4.2. Valor Estratégico para o Cliente** 

| Cliente  | Valor Entregue |
| ----- | ----- |
| **Usina (Indústria)** | **Logística de Salvamento:** Identificação de talhões com degradação rápida para antecipar a colheita“( corte de salvamento”), preservando o ATR. **Previsão de Safra:** Estimativa precisa de TCH para planejamento de moagem. |
| **Produtor  (Fornecedor)** | **Proteção de Patrimônio:** Detecção de focos iniciais de Sphenophorus e Murcha, evitando a perda total do canavial. **Otimização de Recursos:** Direcionamento da equipe de campo (scouting) apenas para os locais com anomalias “( hotspots”). |

**5\. Casos de Uso e Estratégias de Implementação** 

**5.1. Detecção Precoce de SMC em Cana** 

Monitorar NDWI/NDMI e NDRE por talhão, ao longo do ciclo. 

Cruzar quedas anômalas com dados de chuva e solo (para diferenciar estresse hídrico de problema patológico). 

Quando um talhão apresenta NDVI abaixo do esperado, sem seca aparente, o sistema sinaliza suspeita de SMC ou outro problema de raiz. 

A equipe de campo inspeciona apenas os polígonos marcados, coleta amostras de colmo e, se confirmado, toma medidas de manejo (dessecação antecipada, rotação futura, variedade mais tolerante). 

**5.2. Módulo Algodão (Foco: Ramulária)** 

**O Desafio:** A Mancha de Ramulária (Ramularia areola) causa desfolha severa e exige múltiplas aplicações de fungicidas.  
**A Tecnologia:** Uso de bandas Red-Edge e índices NDRE para detectar a doença antes da necrose. 

**Entrega de Valor:** Mapas de Aplicação em Taxa Variável. O produtor aplica fungicida apenas onde há infecção ativa, reduzindo custos e impacto ambiental. 

**5.3. Módulo Cebola (Foco: Doenças e Colheita)** 

**O Desafio:** Alta suscetibilidade a doenças fúngicas (Míldio, Mancha Púrpura) e dificuldade em determinar o ponto exato de colheita“( estalo”). 

**A Tecnologia:** Integração de índices ajustados ao solo (**SAVI**) — essenciais devido à pouca cobertura foliar da cebola — com modelos climáticos de previsão de risco de esporulação fúngica. 

**Entrega de Valor:** Alertas de janelas de risco para aplicação preventiva e determinação do momento ideal de colheita para maximizar a vida de prateleira (shelf-life). 

**6\. Conexão com a Plataforma AtmosAgro** 

**6.1. Fluxo do AtmosAgro** 

Na prática, o AtmosAgro organiza tudo isso em um fluxo simples: 

1\. Coleta de dados (satélite, clima, manejo). 

2\. Processamento e cálculo de índices. 

3\. Análise por talhão (incluindo modelos de risco). 

4\. Geração de mapas e alertas. 

5\. Ação em campo \+ feedback do usuário. 

6\. Aprendizado contínuo dos modelos. 

**6.2. Evolução Planejada** 

1\. **Fase 1**: Monitoramento descritivo (mapas por índice, histórico por talhão). 

2\. **Fase 2**: Monitoramento preditivo (modelos de risco específicos por cultura e doença). 

3\. **Fase 3**: Recomendações de manejo (ações sugeridas, estimativas de impacto, integração com sistemas de gestão). 

**7\. Tabela de Índices, Sintomas Prováveis e Ações Recomendadas** 

| Índice/Padrão  | Sintoma Provável  | Ação Recomendada |
| :---- | :---- | :---- |
| NDWI/NDMI em queda com NDVI ainda alto | Estresse hídrico inicial.  | Revisar irrigação, compactação de solo, drenagem. |
| NDVI em queda forte com NDWI estável em cana | Suspeita de murcha infecciosa (SMC). | Vistoria de colmos, coleta de amostras, considerar manejo específico na área afetada. |
| NDRE em queda com NDVI quase estável | Deficiência de N ou início de doença foliar. | Inspeção foliar; em caso de padrão generalizado, revisar adubação nitrogenada. |
| NDVI \+ NDRE em queda em manchas no algodão | Provável foco de ramulária.  | Vistoria nas manchas e pulverização localizada, se confirmado. |

**8\. Validação e Métricas de Sucesso** 

A credibilidade do sistema depende de uma validação consistente em campo. Sugere-se: 

Selecionar talhões piloto por cultura;  
Registrar todas as inspeções motivadas por alertas (o que foi encontrado, fotos, localização); 

Medir a taxa de acerto dos alertas (verdadeiros positivos, falsos positivos, falsos negativos); 

Acompanhar indicadores de impacto: redução de perdas, economia de defensivos, antecedência média dos avisos. 

**9\. Mercado-Alvo e Posicionamento** 

**Segmentos principais:** 

Usinas e grupos sucroenergéticos (foco inicial em cana-de-açúcar); 

Produtores médios de algodão e cebola; 

Consultorias agronômicas e cooperativas. 

**Diferenciais do AtmosAgro:** 

Foco em sanidade e predição de problemas, não apenas mapas de vegetação; 

Multicultura, começando por cana e expandindo para algodão e cebola; 

Pipeline técnico próprio e reprodutível de sensoriamento remoto; 

Flexibilidade de modelo de negócio (SaaS, parceria, white label). 

**10\. Limitações e Boas Práticas** 

**Limitações técnicas:** 

Resolução de 10 m pode não capturar detalhes muito finos em culturas pequenas ou plantios muito fragmentados; Cobertura de nuvens afeta imagens ópticas; 

O satélite enxerga sintomas (efeito da doença), não o patógeno em si; 

Modelos de risco melhoram com o tempo, à medida que recebem mais feedback. 

**Boas práticas:** 

Sempre confirmar alertas em campo antes de grandes decisões de manejo; 

Usar o sistema como filtro de prioridade, não como substituto do agrônomo; 

Manter cadastros de talhões, variedades e manejos atualizados; 

Participar ativamente do processo de feedback para melhorar a inteligência do AtmosAgro. 

**Conclusão Geral** 

A Síndrome da Murcha da Cana deixou de ser um mistério agronômico para se tornar um desafio tecnológico gerenciável. A ciência identificou os culpados, e a tecnologia espacial forneceu as ferramentas para vigiá-los. O AtmosAgro tem o potencial de integrar o melhor das tecnologias de satélite, índices espectrais e IA em uma plataforma única, ajudando produtores e usinas a enxergar problemas antes que se tornem perdas irreversíveis e, assim, tomar decisões mais rápidas, precisas e sustentáveis. 

**Referências** 

1\. Síndrome da murcha da cana avança no Brasil e chega a impactar até 45% da produtividade \- NovaCana, acessado em novembro 20, 2025, https://www.novacana.com/noticias/sindrome-murcha-cana-avanca-brasil-impactar-45-produtividade- 220125 

2\. Síndrome da murcha da cana avança no Brasil e chega a impactar até 45% da produtividade no campo | Syngenta, acessado em novembro 20, 2025, https://www.syngenta.com.br/sindrome-da-murcha-da-cana-avanca-no-brasil-e-chega-impactar-  
ate-45-da-produtividade-no-campo 

3\. Síndrome da murcha da cana: o que está acontecendo, afinal …, acessado em novembro 20, 2025, https://maisagro.syngenta.com.br/dia-a-dia-do-campo/sindrome-da-murcha-da-cana-o-que-esta-acontecendo-afinal/ 

4\. CTC confirma Colletotrichum falcatum como agente da Murcha da Cana \- Canaoeste, acessado em novembro 20, 2025, https://canaoeste.com.br/noticias/ctc-confirma-colletotrichum-falcatum-como-agente-da-murcha-da-cana/ 

5\. Molecular Characterization and Pathogenicity of Colletotrichum falcatum Causing Red Rot on Sugarcane in Southern Florida \- PMC \- NIH, acessado em novembro 20, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC11595498/ 

6\. CTC desvenda agente causal da murcha da cana e abre caminho para soluções, acessado em novembro 20, 2025, https://agribrasilis.com/2025/10/27/agente-causal-murcha-cana/ 

7\. No lançamento da plataforma Esfera, CTC divulga causador da Síndrome da Murcha a Cana, acessado em novembro 20, 2025, https://www.canaonline.com.br/conteudo/no-lancamento-da-plataforma-esfera-ctc-divulga-causador-da-sindrome da-murcha-a-cana.html 

8\. Estimation of Sugarcane Yield Using Multi-temporal Sentinel 2 Satellite Imagery and Random Forest Regression, acessado em novembro 20, 2025, https://digitalcommons.unl.edu/droughtfacpub/224/ 

9\. (PDF) ESTIMATION OF SUGARCANE YIELD USING MULTI-TEMPORAL SENTINEL 2 SATELLITE IMAGERY AND RANDOM FOREST REGRESSION \- ResearchGate, acessado em novembro 20, 2025, 

https://www.researchgate.net/publication/378833598\_ESTIMATION\_OF\_SUGARCANE\_YIELD\_USING\_MULTI TEMPORAL\_SENTINEL\_2\_SATELLITE\_IMAGERY\_AND\_RANDOM\_FOREST\_REGRESSION 

10\. Early Warning for Sugarcane Growth using Phenology-Based Remote Sensing by Region \- The Science and Information (SAI) Organization, acessado em novembro 20, 2025, https://thesai.org/Downloads/Volume14No2/Paper\_59- Early\_Warning\_for\_Sugarcane\_Growth.pdf 

11\. Cotton aphid infestation monitoring using Sentinel-2 MSI imagery coupled with derivative of ratio spectroscopy and random forest algorithm \- PubMed Central, acessado em novembro 20, 2025, https://pmc.ncbi.nlm.nih.gov/articles/PMC9745077/ 

12\. Comparison of PlanetScope and Sentinel-2 Spectral Channels and Their Alignment via Linear Regression for Enhanced Index Derivation \- MDPI, acessado em novembro 20, 2025, https://www.mdpi.com/2076-3263/15/5/184 

13\. Early Warning for Sugarcane Growth using Phenology-Based Remote Sensing by Region, acessado em novembro 20, 2025, https://thesai.org/Publications/ViewPaper?Volume=14\&Issue=2\&Code=IJACSA\&SerialNo=59 

14\. Sugarcane yield estimation through remote sensing time series and phenology metrics \- the NOAA Institutional Repository, acessado em novembro 20, 2025, https://repository.library.noaa.gov/view/noaa/68212/noaa\_68212\_DS1.pdf 

15\. (PDF) Adaptive multi-year machine learning model to predict sugarcane yield, acessado em novembro 20, 2025, https://www.researchgate.net/publication/394561962\_Adaptive\_multi   
year\_machine\_learning\_model\_to\_predict\_sugarcane\_yield 

16\. IMPACTOS E PERSPECTIVAS PARA A COTONICULTURA BRASILEIRA, acessado em novembro 20, 2025, https://periodicos.fgv.br/agroanalysis/article/download/87867/82644/192563 

17\. Exploring vegetation indices adequate in detecting twister disease of onion using Sentinel-2 imagery | Request PDF \- ResearchGate, acessado em novembro 20, 2025, 

https://www.researchgate.net/publication/336740322\_Exploring\_vegetation\_indices\_adequate\_in\_detecting\_twister\_diseas 2\_imagery