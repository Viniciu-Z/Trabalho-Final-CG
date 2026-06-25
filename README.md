# Museu Noturno

Este projeto consiste no desenvolvimento de um **Passeio Virtual**, desenvolvido como **trabalho final da disciplina de Computação Gráfica**. 
A aplicação foi construída utilizando exclusivamente **WebGL puro**, sem o auxílio de bibliotecas de alto nível (como Three.js).

O contexto deste **passeio virtual** se passa em um **museu fechado** durante a noite. Sem encontrar uma maneira de sair, você **explora o ambiente** tendo apenas 
uma lanterna para iluminar o caminho. Então você decide aproveitar a oportunidade para admirar as exposições presentes na sala e 
conhecer mais sobre as obras em exibição.

## Controles
- `W` `A` `S` `D` – Movimentação do personagem.
- `Mouse` – Controle da câmera e direção do olhar.

## Cenário
**Ambiente:**
- Ambiente interno de um museu contendo **cinco exibições**, cada uma posicionada sobre um pedestal.
- Iluminação reduzida para simular um museu fechado durante a noite, reforçando a atmosfera de exploração com o **auxílio de uma lanterna**.
- As paredes utilizam texturas que representam o **ambiente do museu**. Devido às limitações de tempo para a finalização do projeto, o teto e o chão utilizam as mesmas texturas das paredes, servindo como uma solução temporária para a composição do cenário.

**Objetos:**
- **Caveira Gigante**: modelo com textura aplicada e animação.
- **Esqueleto de Mamute**: modelo com textura aplicada.
- **Esqueleto de Dinossauro**: modelo sem textura, renderizado com uma cor sólida branca.
- **Espada**: modelo sem textura, utilizando uma coloração sólida em tom de esmeralda.
- **Escultura de Torso**: modelo com textura que simula bronze, representando uma obra de caráter artístico e histórico.

## Requisitos
### Requisitos Gerais
- Movimentação do jogador no ambiente 3D
- Iluminação do ambiente utilizando o modelo de reflexão Phong com movimentação de uma fonte de luz (lanterna)
- Objeto Skull (caveira) animado por meio de transformações geométricas
- Objetos 3D carregados por meio de um leitor próprio de arquivos OBJ
- 3 objetos com textura e 2 com cor sólida, texturas nas paredes da sala, pedestais com cor sólida
- Desenho da cena feito em WebGL Puro

### Requisitos do Passeio Virtual
- Câmera em primeira pessoa, com movimentação do olhar com mouse
- Controle da câmera com WASD
- Colisão simples nas paredes e nos pedestais
- O cenário foi construído manualmente no código, não foram usados modelos externos a não ser para as exibições

## Vídeo
**Link do Repósitorio:** https://github.com/Viniciu-Z/Trabalho-Final-CG.git

https://github.com/user-attachments/assets/0f568665-1701-4e0c-b613-5c7ac262b922



## Como Executar
- Instale a extensão do vscode **Live Server** 
- clique no botão inferior direito `Go Live` para rodar
