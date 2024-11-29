import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'editar-usuario',
    templateUrl: './editar_usuario.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatButtonModule,
        RouterModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        CommonModule,
        MatSelectModule,
        MatButtonToggleModule,
        ReactiveFormsModule
    ],
})
export class EditarUsuarioComponent implements OnInit {
    isActive: boolean = true;
    formFieldHelpers = ''; // Propiedad o clase para ayuda en el campo
    editForm: UntypedFormGroup; // Formulario de edición
    userId: string; // ID del usuario a editar

    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
    ) {}

    ngOnInit(): void {
        // Obtener el ID del usuario desde la ruta
        this.userId = this._activatedRoute.snapshot.paramMap.get('id') || '';

        // Inicializar el formulario
        this.editForm = this._formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rol: [1, Validators.required], // Básico por defecto
            estado: [0, Validators.required] // Activo por defecto
        });

        // Cargar los datos del usuario para edición
        if (this.userId) {
            this._authService.getUserById(this.userId).subscribe(
                (user) => {
                    this.editForm.patchValue(user); // Cargar los datos del usuario en el formulario
                },
                (error) => {
                    console.error('Error al cargar los datos del usuario:', error);
                }
            );
        }
    }

    // Función para enviar el formulario de edición
    onSubmit(): void {
        if (this.editForm.valid) {
            this.editForm.disable(); // Desactivar el formulario

            // Actualizar el usuario
            this._authService.updateUser(this.userId, this.editForm.value).subscribe(
                () => {
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/gestion_usuarios';
                    this._router.navigateByUrl(redirectURL);
                },
                (error) => {
                    console.error('Error durante la actualización:', error);
                    this.editForm.enable(); // Rehabilitar el formulario
                }
            );
        } else {
            console.log('Formulario no válido');
        }
    }

    // Función para cancelar la edición
    cancel(): void {
        this._router.navigate(['/gestion_usuarios']);
    }
}