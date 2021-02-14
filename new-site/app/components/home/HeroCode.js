import { CodeWindow } from "../CodeWindow"
import tokenize from "../../macros/tokenize.macro"
import { useState } from "react"

const pageTokenized = tokenize.jsx(
  `import { Head, Link, useRouter } from 'blitz'
import createQuestion from 'app/questions/mutations/createQuestion'

const NewQuestionPage = () => {
  const router = useRouter()

  return (
    <div className="container">
      <Head>
        <title>New Question</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Create New Question </h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault()

            try {
              const question = await createQuestion({
                data: {
                  text: event.target[0].value,
                  publishedAt: new Date(),
                  choices: {
                    create: [
                      {text: event.target[1].value},
                      {text: event.target[2].value},
                      {text: event.target[3].value},
                    ],
                  },
                },
              })
              alert("Success!" + JSON.stringify(question))
            } catch (error) {
              alert("Error creating question " + JSON.stringify(error, null, 2))
            }
          }}
        />
        <p>
          <Link href="/questions">
            <a>Questions</a>
          </Link>
        </p>
      </main>
    </div>
  )
}
export default NewQuestionPage`,
  true
)

const mutationTokenized = tokenize.jsx(
  `import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreateQuestionInput = Pick<Prisma.QuestionCreateArgs, "data">
export default async function createQuestion({ data }: CreateQuestionInput, ctx: Ctx) {
  ctx.session.authorize()

  const question = await db.question.create({ data })

  return question
}`,
  true
)

const HeroCode = ({ className = "" }) => {
  const [tabs, setTabs] = useState([
    {
      title: "pages/questions/new.tsx",
      tokens: pageTokenized.tokens,
      selected: true,
    },
    {
      title: "mutations/createQuestion.ts",
      tokens: mutationTokenized.tokens,
      selected: false,
    },
  ])
  return (
    <CodeWindow
      className={className}
      tabs={tabs}
      onTabClick={(tabIndex) => {
        setTabs(
          tabs.map((tab, i) => ({
            ...tab,
            selected: i === tabIndex,
          }))
        )
      }}
    >
      <CodeWindow.Code tokens={tabs.find((tab) => tab.selected).tokens} />
    </CodeWindow>
  )
}

export { HeroCode }
