#!/bin/bash

# ゾスマンラン AWS S3 デプロイスクリプト

set -e

# 使用方法チェック
if [ $# -eq 0 ]; then
    echo "使用方法: $0 <bucket-name>"
    echo "例: $0 my-zosman-run-game"
    exit 1
fi

BUCKET_NAME=$1
REGION="ap-northeast-1"

echo "🚀 ゾスマンランをAWS S3にデプロイします..."
echo "バケット名: $BUCKET_NAME"
echo "リージョン: $REGION"

# AWS CLIがインストールされているかチェック
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLIがインストールされていません"
    echo "インストール方法: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# AWS認証情報をチェック
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS認証情報が設定されていません"
    echo "設定方法: aws configure"
    exit 1
fi

echo "✅ AWS CLIの設定を確認しました"

# S3バケットを作成
echo "📦 S3バケットを作成中..."
if aws s3 mb s3://${BUCKET_NAME} --region ${REGION} 2>/dev/null; then
    echo "✅ バケット '${BUCKET_NAME}' を作成しました"
else
    echo "ℹ️  バケット '${BUCKET_NAME}' は既に存在します"
fi

# 静的ウェブサイトホスティングを有効化
echo "🌐 静的ウェブサイトホスティングを設定中..."
aws s3 website s3://${BUCKET_NAME} \
    --index-document index.html \
    --error-document index.html

echo "✅ ウェブサイトホスティングを有効化しました"

# バケットポリシーを作成
echo "🔓 パブリックアクセスポリシーを設定中..."
cat > /tmp/policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

# パブリックアクセスブロックを無効化
aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# ポリシーを適用
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file:///tmp/policy.json

echo "✅ パブリックアクセスポリシーを設定しました"

# ファイルをアップロード
echo "📤 ゲームファイルをアップロード中..."
aws s3 sync . s3://${BUCKET_NAME}/ \
    --exclude "*.md" \
    --exclude "*.sh" \
    --exclude ".git/*" \
    --exclude ".DS_Store" \
    --cache-control "max-age=3600" \
    --delete

echo "✅ ファイルのアップロードが完了しました"

# ウェブサイトURLを表示
WEBSITE_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
echo ""
echo "🎉 デプロイが完了しました！"
echo "🌐 ウェブサイトURL: ${WEBSITE_URL}"
echo ""
echo "📝 注意事項:"
echo "   - DNS伝播に数分かかる場合があります"
echo "   - HTTPSを使用したい場合はCloudFrontの設定が必要です"
echo ""

# クリーンアップ
rm -f /tmp/policy.json

echo "✨ ゾスマンランをお楽しみください！"