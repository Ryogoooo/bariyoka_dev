import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Image, MessageSquare, Layers, Palette, History } from "lucide-react"

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-black text-green-900">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">AI Image Editor</h1>
          <p className="text-xl text-green-100 opacity-80">革新的なノードベース画像生成・編集ツール</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<Layers className="w-8 h-8" />} title="ノードベースの画像生成">
            直感的な操作で画像内のオブジェクトを編集
          </FeatureCard>
          <FeatureCard icon={<MessageSquare className="w-8 h-8" />} title="自然言語によるプロパティ編集">
            簡単な文章でオブジェクトのプロパティを変更
          </FeatureCard>
          <FeatureCard icon={<Image className="w-8 h-8" />} title="Impainting技術">
            自然な形でオブジェクトの追加・削除・変更が可能
          </FeatureCard>
          <FeatureCard icon={<Palette className="w-8 h-8" />} title="スタイルの提案">
            複数のスタイル候補から好みのものを選択
          </FeatureCard>
          <FeatureCard icon={<History className="w-8 h-8" />} title="履歴管理">
            編集履歴を保存し、過去の状態に簡単にアクセス
          </FeatureCard>
        </div>
        <div className="text-center mt-16">
          <Link href="/dashboard">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg">
              今すぐ試す <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

        </div>
      </div>
    </div>

  )
}

function FeatureCard({ icon, title, children }) {
  return (
    <Card className="bg-green-100 bg-opacity-90 border-green-300 hover:bg-green-200 transition-colors duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-green-700">{icon}</div>
          <h2 className="text-xl font-semibold ml-3 text-green-800">{title}</h2>
        </div>
        <p className="text-green-700">{children}</p>
      </CardContent>
    </Card>
  )
}