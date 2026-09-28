import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Necessário para [(ngModel)]
import { ChangeDetectorRef } from '@angular/core';
import { ProdutoControllerService, ProdutoResponseDTO, ProdutoRequestDTO } from './api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Adicionado FormsModule
  template: `
    <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
      <h2>Mini-ERP - Gestão de Representantes</h2>
      <p style="color: #2e7d32; font-weight: bold;">✔ Front-end conectado à API com sucesso!</p>
      
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;" />

      <!-- Formulário de Cadastro -->
      <div style="background: #f4f6f8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3>Cadastrar Novo Produto</h3>
        <form (ngSubmit)="salvarProduto()" style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Nome:</label>
            <input type="text" [(ngModel)]="novoProduto.nome" name="nome" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Preço (R$):</label>
            <input type="number" step="0.01" [(ngModel)]="novoProduto.preco" name="preco" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
          </div>
          <div>
            <label style="display: block; font-weight: bold; margin-bottom: 4px;">Quantidade em Estoque:</label>
            <input type="number" [(ngModel)]="novoProduto.quantidadeEstoque" name="quantidadeEstoque" required style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
          </div>
          <button type="submit" style="background: #1976d2; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Salvar Produto
          </button>
        </form>
      </div>

      <h3>Lista de Produtos cadastrados no Backend:</h3>
      
      <div *ngIf="produtos.length > 0; else semProdutos">
        <ul style="list-style-type: none; padding: 0;">
          <li *ngFor="let p of produtos" style="background: #f9f9f9; padding: 12px; margin-bottom: 8px; border-radius: 6px; border: 1px solid #eee;">
            <strong>ID:</strong> {{ p.id }} | <strong>Nome:</strong> {{ p.nome }} | <strong>Preço:</strong> R$ {{ p.preco }} | <strong>Estoque:</strong> {{ p.quantidadeEstoque }}
          </li>
        </ul>
      </div>

      <ng-template #semProdutos>
        <p style="color: #666; font-style: italic;">Nenhum produto encontrado...</p>
      </ng-template>
    </div>
  `
})
export class App implements OnInit {
  private produtoService = inject(ProdutoControllerService);
  private cdr = inject(ChangeDetectorRef);
  
  produtos: ProdutoResponseDTO[] = [];

  // Objeto vinculado ao formulário utilizando o DTO gerado pelo OpenAPI
  novoProduto: ProdutoRequestDTO = {
    nome: '',
    preco: 0,
    quantidadeEstoque: 0
  };

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    // ANTES (provavelmente com algum argumento extra que quebrou)
    // DEPOIS (forma limpa padrão):
    this.produtoService.listar('body', false).subscribe({
      next: (dados) => {
        console.log('Dados recebidos com sucesso:', dados);
        this.produtos = dados;
        this.cdr.detectChanges();  
      },
      error: (err) => console.error(err)
    });
  }

  salvarProduto() {
    // ANTES (com o objeto options ou observe incorreto)
    // DEPOIS (forma limpa padrão):
    this.produtoService.criar(this.novoProduto).subscribe({
      next: (produtoCriado) => {
        console.log('Produto criado com sucesso!', produtoCriado);
        this.carregarProdutos(); // Atualiza a lista
      },
      error: (err) => console.error(err)
    });
  }
}