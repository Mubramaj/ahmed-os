class CreatePosts < ActiveRecord::Migration[8.1]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.text :body, null: false
      t.string :slug
      t.string :category
      t.text :excerpt
      t.boolean :published, default: false
      t.datetime :published_at

      t.timestamps
    end
  end
end
