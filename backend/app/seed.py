from datetime import date

import click
from flask.cli import with_appcontext

from app import db
from app.models import Category, ContactLink, Post, Profile, Project, Tag

PYTHON_CONTENT = """\
## O que é Python?

Python é uma linguagem de programação de alto nível, interpretada e de tipagem dinâmica,
conhecida pela sintaxe simples e legível. É usada em automação, ciência de dados, backend
web e muito mais.

## Variáveis e tipos básicos

```python
nome = "Caroline"
idade = 25
ativo = True
```

Python infere o tipo automaticamente a partir do valor atribuído — não é preciso declarar o
tipo da variável.

## Estruturas de controle

```python
for i in range(5):
    if i % 2 == 0:
        print(f"{i} é par")
    else:
        print(f"{i} é ímpar")
```

## Funções

```python
def saudacao(nome: str) -> str:
    return f"Olá, {nome}!"
```

Funções em Python podem ter tipagem opcional (type hints), valores padrão para parâmetros e
retornar múltiplos valores usando tuplas.

## Próximos passos

Depois de dominar o básico, vale a pena estudar orientação a objetos, tratamento de exceções
e o ecossistema de bibliotecas (requests, pandas, Flask, entre outras).
"""

REACT_CONTENT = """\
## O que é React?

React é uma biblioteca JavaScript para construção de interfaces declarativas e baseadas em
componentes, mantida pelo Meta. Ela usa um Virtual DOM para atualizar a tela de forma eficiente.

## Componentes e JSX

```tsx
function Saudacao({ nome }: { nome: string }) {
  return <h1>Olá, {nome}!</h1>;
}
```

JSX permite escrever HTML dentro do JavaScript/TypeScript, compilado para chamadas de
`React.createElement` por baixo dos panos.

## Estado com useState

```tsx
const [contador, setContador] = useState(0);

<button onClick={() => setContador((c) => c + 1)}>
  Cliques: {contador}
</button>
```

## Efeitos colaterais com useEffect

```tsx
useEffect(() => {
  document.title = `Cliques: ${contador}`;
}, [contador]);
```

## Próximos passos

Depois do básico, vale explorar hooks customizados, contexto (Context API), roteamento com
react-router e gerenciamento de estado global.
"""


def _get_or_create_category(name: str, slug: str, color: str) -> Category:
    category = Category.query.filter_by(slug=slug).first()
    if category is None:
        category = Category(name=name, slug=slug, color=color)
        db.session.add(category)
        db.session.flush()
    return category


def _get_or_create_tag(name: str, slug: str, category: Category) -> Tag:
    tag = Tag.query.filter_by(slug=slug).first()
    if tag is None:
        tag = Tag(name=name, slug=slug, category=category)
        db.session.add(tag)
        db.session.flush()
    return tag


def seed_database():
    db.drop_all()
    db.create_all()

    backend = _get_or_create_category("Backend", "backend", "indigo")
    frontend = _get_or_create_category("Frontend", "frontend", "pink")

    docker = _get_or_create_tag("Docker", "docker", backend)
    api_rest = _get_or_create_tag("API Rest", "api-rest", backend)
    python_tag = _get_or_create_tag("Python", "python", backend)
    poo_tag = _get_or_create_tag("POO", "poo", backend)

    react_js = _get_or_create_tag("React JS", "react-js", frontend)
    typescript_tag = _get_or_create_tag("TypeScript", "typescript", frontend)
    react_tag = _get_or_create_tag("React", "react", frontend)

    # keep the sidebar tag list stable even though only some tags are used on posts below
    _ = (docker, api_rest, react_js, typescript_tag)

    db.session.add_all(
        [
            Post(
                slug="nocoes-basicas-de-python",
                title="Noções Básicas de Python",
                excerpt=(
                    "Este resumo abrange os conceitos básicos para quem está começando a "
                    "programar ou quer entender as funções da linguagem."
                ),
                content=PYTHON_CONTENT,
                published_at=date(2026, 8, 17),
                category=backend,
                tags=[python_tag, poo_tag],
            ),
            Post(
                slug="nocoes-basicas-de-react",
                title="Noções Básicas de React",
                excerpt=(
                    "Este resumo abrange os conceitos básicos para quem está começando a "
                    "programar ou quer entender as funções da linguagem."
                ),
                content=REACT_CONTENT,
                published_at=date(2026, 8, 17),
                category=frontend,
                tags=[react_tag],
            ),
        ]
    )

    db.session.add(
        Profile(
            name="Caroline Laís",
            role="Software Developer",
            bio="AI, Software Development, Design Thinking.",
            about=(
                "Sou desenvolvedora de software com interesse em inteligência artificial, "
                "desenvolvimento de software e design thinking. Este espaço reúne resumos e "
                "anotações de estudo sobre programação."
            ),
            avatar_url=None,
            avatar_initials="CL",
        )
    )

    db.session.add_all(
        [
            Project(name="CareOps", url=None, description=None),
            Project(name="Lendora", url=None, description=None),
        ]
    )

    db.session.add_all(
        [
            ContactLink(
                platform="github",
                label="GitHub",
                url="https://github.com/acarolinelais",
            ),
            ContactLink(
                platform="linkedin",
                label="LinkedIn",
                url="https://www.linkedin.com/in/acarolinelais/",
            ),
        ]
    )

    db.session.commit()


@click.command("seed-db")
@with_appcontext
def seed_db_command():
    """Drop and recreate all tables, then insert the demo content."""
    seed_database()
    click.echo("Database seeded.")
