# Vamos criar a estrutura de arquivos para o projeto
import os

# Criar diretórios
os.makedirs('css', exist_ok=True)
os.makedirs('js', exist_ok=True)
os.makedirs('img', exist_ok=True)
os.makedirs('lib', exist_ok=True)

# Listar a estrutura de diretórios criada
print("Estrutura de diretórios criada com sucesso:")
for dirpath, dirnames, filenames in os.walk('.'):
    if '.git' not in dirpath:  # Ignore git directories
        for dirname in dirnames:
            print(os.path.join(dirpath, dirname))