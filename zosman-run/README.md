# ゾスマンラン

パックマン風のアーケードゲーム

## ゲームの遊び方

- **矢印キー**: プレイヤーを移動
- **目的**: 全てのドット（黄色い点）を集める
- **注意**: 赤い敵に触れるとゲームオーバー
- **特別なドット**: 大きな光るドットは50点！

## 機能

- 4体の敵キャラクター（簡単なAI搭載）
- スコアシステム
- ゲームクリア/ゲームオーバー判定
- レスポンシブデザイン

## AWS S3へのデプロイ方法

### 1. S3バケットの作成

```bash
# バケット名を設定（グローバルで一意である必要があります）
BUCKET_NAME="your-zosman-run-game"

# S3バケットを作成
aws s3 mb s3://${BUCKET_NAME} --region ap-northeast-1
```

### 2. 静的ウェブサイトホスティングを有効化

```bash
# ウェブサイトホスティングを設定
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document index.html
```

### 3. バケットポリシーを設定（パブリックアクセス）

```bash
# policy.jsonファイルを作成
cat > policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    }
  ]
}
EOF

# BUCKET_NAMEを実際のバケット名に置換
sed -i '' "s/BUCKET_NAME/${BUCKET_NAME}/g" policy.json

# ポリシーを適用
aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file://policy.json
```

### 4. ファイルをアップロード

```bash
# ゲームファイルをアップロード
aws s3 sync . s3://${BUCKET_NAME}/ \
  --exclude "*.md" \
  --exclude "policy.json" \
  --exclude "deploy.sh" \
  --cache-control "max-age=3600"
```

### 5. アクセス

ウェブサイトURL:
```
http://${BUCKET_NAME}.s3-website-ap-northeast-1.amazonaws.com
```

## 簡単デプロイスクリプト

`deploy.sh`を実行するだけでデプロイできます：

```bash
chmod +x deploy.sh
./deploy.sh your-bucket-name
```

## CloudFront（CDN）を使用する場合

より高速なアクセスのためにCloudFrontを設定：

```bash
# CloudFrontディストリビューションを作成
aws cloudfront create-distribution \
  --origin-domain-name ${BUCKET_NAME}.s3-website-ap-northeast-1.amazonaws.com \
  --default-root-object index.html
```

## ローカルでのテスト

ブラウザで`index.html`を直接開くだけで動作します。

## 技術スタック

- HTML5 Canvas
- Vanilla JavaScript
- CSS3

## ライセンス

MIT
